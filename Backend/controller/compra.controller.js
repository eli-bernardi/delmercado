const { sequelize } = require('../db/conn');
const Compra = require('../models/Compra');
const Produto = require('../models/Produto');
const Usuario = require('../models/Usuario');
const VwHistoricoSaida = require('../models/VwHistoricoSaida');

const cadastrar = async (req, res) => {
  const valores = req.body;

  // Valida campos obrigatórios de acordo com o modelo
  if (!valores.idUsuario || !valores.idProduto || !valores.tipo ||
    !valores.qtdeMov || !valores.formaPagamento || !valores.statusCompra) {
    return res.status(400).json({ message: 'Campos obrigatórios: idUsuario, idProduto, tipo, qtdeMov, formaPagamento, statusCompra.' });
  }

  if (valores.qtdeMov <= 0) {
    return res.status(400).json({ message: 'Quantidade movimentada deve ser maior que zero.' });
  }

  const transaction = await sequelize.transaction();
  try {
    const usuario = await Usuario.findByPk(valores.idUsuario, { transaction });
    if (!usuario) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    const produto = await Produto.findByPk(valores.idProduto, { transaction });
    if (!produto) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Produto não encontrado.' });
    }

    const precoUnitario = parseFloat(produto['Preço']);
    const desconto = parseFloat(produto['Percentual de desconto']) || 0;
    const precoFinal = (precoUnitario * (1 - desconto / 100)) * valores.qtdeMov;

    if (valores.tipo === 'SAIDA') {
      if (produto.Quantidade < valores.qtdeMov) {
        await transaction.rollback();
        return res.status(400).json({ message: 'Saldo insuficiente em estoque.' });
      }
      produto.Quantidade -= parseInt(valores.qtdeMov, 10);
    } else if (valores.tipo === 'ENTRADA') {
      produto.Quantidade += parseInt(valores.qtdeMov, 10);
    } else {
      await transaction.rollback();
      return res.status(400).json({ message: 'Tipo de movimento inválido. Use ENTRADA ou SAIDA.' });
    }

    await produto.save({ transaction });

    const novaCompra = await Compra.create({
      idUsuario: valores.idUsuario,
      idProduto: valores.idProduto,
      tipo: valores.tipo,
      qtdeMov: valores.qtdeMov,
      precoUnit: precoUnitario,
      descAplicado: desconto,
      precoFinal,
      formaPagamento: valores.formaPagamento,
      statusCompra: valores.statusCompra,
      dataCompra: new Date()
    }, { transaction });

    await transaction.commit();
    res.status(201).json({ message: 'Compra registrada com sucesso!', dados: novaCompra });
  } catch (err) {
    await transaction.rollback();
    console.error('Não foi possível registrar a compra', err);
    res.status(500).json({ message: 'Não foi possível registrar a compra' });
  }
};

const listar = async (req, res) => {
  try {
    const dados = await Compra.findAll({
      include: [
        { model: Usuario, as: 'usuario', attributes: ['Nome', 'Sobrenome'] },
        { model: Produto, as: 'produto', attributes: ['Nome'] }
      ],
      order: [['dataCompra', 'DESC']]
    });
    res.status(200).json(dados);
  } catch (err) {
    console.error('Não foi possível listar as compras', err);
    res.status(500).json({ message: 'Não foi possível listar as compras' });
  }
};

const buscarPorCod = async (req, res) => {
  const id = req.params.id;
  try {
    const dados = await Compra.findByPk(id, {
      include: [
        { model: Usuario, as: 'usuario', attributes: ['Nome', 'Sobrenome'] },
        { model: Produto, as: 'produto', attributes: ['Nome'] }
      ]
    });
    if (!dados) {
      return res.status(404).json({ message: 'Compra não encontrada!' });
    }
    res.status(200).json(dados);
  } catch (err) {
    console.error('Não foi possível encontrar a compra', err);
    res.status(500).json({ message: 'Não foi possível encontrar a compra' });
  }
};

// Relatório de produtos com estoque crítico
const relatorioProdutosCriticos = async (req, res) => {
  try {
    const [results] = await sequelize.query('SELECT * FROM vw_produtos_criticos');
    res.status(200).json(results);
  } catch (err) {
    console.error('Erro ao buscar produtos críticos', err);
    res.status(500).json({ message: 'Erro ao buscar produtos críticos' });
  }
};

// Relatório de volume financeiro movimentado por produto
const relatorioVolumeCompras = async (req, res) => {
  try {
    const results = await VwHistoricoSaida.findAll({
      order: [['valor_financeiro_movimentado', 'DESC']]
    });
    res.status(200).json(results);
  } catch (err) {
    console.error('Erro ao buscar volume de compras', err);
    res.status(500).json({ message: 'Erro ao buscar volume de compras' });
  }
};

// Dados para gráficos (estoque crítico e top 5 financeiro)
const relatorioGraficos = async (req, res) => {
  try {
    const [estoqueCritico] = await sequelize.query(
      'SELECT Nome as title, Quantidade as stock FROM produtos WHERE Quantidade < 10'
    );

    const volumeComprasTop5 = await VwHistoricoSaida.findAll({
      limit: 5,
      order: [['valor_financeiro_movimentado', 'DESC']]
    });

    res.status(200).json({
      estoqueCritico,
      volumeCompras: volumeComprasTop5
    });
  } catch (err) {
    console.error('Erro ao gerar dados para gráficos', err);
    res.status(500).json({ message: 'Erro ao gerar dados para gráficos' });
  }
};

module.exports = { cadastrar, listar, buscarPorCod, relatorioProdutosCriticos, relatorioVolumeCompras, relatorioGraficos };