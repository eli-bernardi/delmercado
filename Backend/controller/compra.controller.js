const { sequelize } = require('../db/conn');
const Compra = require('../models/Compra');
const Produto = require('../models/Produto');
const Usuario = require('../models/Usuario');
const VwHistoricoSaida = require('../models/VwHistoricoSaida');

// Register a movement (ENTRADA or SAIDA)
exports.create = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const {
      codUsuario,
      codProduto,
      tipoMovimento,
      quantidadeMovimentada,
      formaPagamento,
      statusCompra
    } = req.body;

    // Validation of basic input
    if (!codUsuario || !codProduto || !tipoMovimento || !quantidadeMovimentada || !formaPagamento || !statusCompra) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    if (quantidadeMovimentada <= 0) {
      return res.status(400).json({ error: 'Quantidade movimentada deve ser maior que zero' });
    }

    // Verify user
    const usuario = await Usuario.findByPk(codUsuario, { transaction });
    if (!usuario) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Verify product
    const produto = await Produto.findByPk(codProduto, { transaction });
    if (!produto) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    // Calculate Prices
    const precoUnitario = parseFloat(produto['Preço']);
    const desconto = parseFloat(produto['Percentual de desconto']) || 0;
    const precoFinal = (precoUnitario * (1 - desconto / 100)) * quantidadeMovimentada;

    // Stock verification and update
    if (tipoMovimento === 'SAIDA') {
      if (produto.Quantidade < quantidadeMovimentada) {
        await transaction.rollback();
        return res.status(400).json({ error: 'Saldo insuficiente em estoque' });
      }
      produto.Quantidade -= parseInt(quantidadeMovimentada, 10);
    } else if (tipoMovimento === 'ENTRADA') {
      produto.Quantidade += parseInt(quantidadeMovimentada, 10);
    } else {
      await transaction.rollback();
      return res.status(400).json({ error: 'Tipo de movimento inválido. Use ENTRADA ou SAIDA' });
    }

    // Save updated product stock
    await produto.save({ transaction });

    // Create purchase record
    const novaCompra = await Compra.create({
      codUsuario,
      codProduto,
      tipoMovimento,
      quantidadeMovimentada,
      precoUnitario,
      descontoAplicado: desconto,
      precoFinal,
      formaPagamento,
      statusCompra,
      dataCompra: new Date()
    }, { transaction });

    await transaction.commit();
    res.status(201).json(novaCompra);
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
};

// Get all purchase movements logs
exports.getAll = async (req, res) => {
  try {
    const compras = await Compra.findAll({
      include: [
        { model: Usuario, as: 'usuario', attributes: ['Nome', 'Sobrenome'] },
        { model: Produto, as: 'produto', attributes: ['Nome'] }
      ],
      order: [['dataCompra', 'DESC']]
    });
    res.json(compras);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Relatório 1: Produtos Críticos (vw_produtos_criticos)
exports.getProdutosCriticos = async (req, res) => {
  try {
    // Query directly from database view vw_produtos_criticos
    const [results] = await sequelize.query('SELECT * FROM vw_produtos_criticos');
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Relatório 2: Volume Comprado por Produto (vw_volume_compras)
exports.getVolumeCompras = async (req, res) => {
  try {
    // Query directly using our mapping model VwHistoricoSaida
    const results = await VwHistoricoSaida.findAll({
      order: [['valor_financeiro_movimentado', 'DESC']]
    });
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Relatório Gráfico Data
exports.getGraficos = async (req, res) => {
  try {
    // Gráfico 1: Estoque Físico Atual (todos os produtos com estoque < 10)
    // Eixo X: Nome do produto, Eixo Y: quantidade de itens em estoque.
    const [estoqueCritico] = await sequelize.query('SELECT Nome as title, Quantidade as stock FROM produtos WHERE Quantidade < 10');

    // Gráfico 2: Volume Financeiro de Compras (5 produtos com maior valor financeiro movimentado)
    // Eixo X: Valor financeiro total movimentado, Eixo Y: Nome do produto.
    const volumeComprasTop5 = await VwHistoricoSaida.findAll({
      limit: 5,
      order: [['valor_financeiro_movimentado', 'DESC']]
    });

    res.json({
      estoqueCritico,
      volumeCompras: volumeComprasTop5
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
