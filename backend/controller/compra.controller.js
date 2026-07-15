const sequelize = require('../db/conn');
const Compra = require('../models/Compra');
const Produto = require('../models/Produto');
const Usuario = require('../models/Usuario');
const VwProdutosCriticos = require('../models/Vw_produtos_criticos');
const VwVolumeCompras = require('../models/Vw_volume_compras');

const cadastrar = async (req, res) => {
  const valores = req.body;

  // Normaliza os campos que o frontend envia
  const codUsuario = valores.codUsuario || valores.idUsuario;
  const codProduto = valores.codProduto || valores.idProduto;
  const tipoMovimento = valores.tipoMovimento || valores.tipo;
  const quantidadeMovimentada = valores.quantidadeMovimentada || valores.qtdeMov;
  const formaPagamento = valores.formaPagamento;
  const statusCompra = valores.statusCompra;

  // Valida campos obrigatórios
  if (!codUsuario || !codProduto || !tipoMovimento || !quantidadeMovimentada || !formaPagamento || !statusCompra) {
    return res.status(400).json({ message: 'Campos obrigatórios: codUsuario, codProduto, tipoMovimento, quantidadeMovimentada, formaPagamento, statusCompra.' });
  }

  if (quantidadeMovimentada <= 0) {
    return res.status(400).json({ message: 'Quantidade movimentada deve ser maior que zero.' });
  }

  const transaction = await sequelize.transaction();
  try {
    const usuario = await Usuario.findByPk(codUsuario, { transaction });
    if (!usuario) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    const produto = await Produto.findByPk(codProduto, { transaction });
    if (!produto) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Produto não encontrado.' });
    }

    const precoUnitario = parseFloat(produto.Preco);
    const desconto = parseFloat(produto.PercentualDesconto) || 0;
    const precoFinal = (precoUnitario * (1 - desconto / 100)) * quantidadeMovimentada;

    if (tipoMovimento === 'SAIDA') {
      if (produto.Quantidade < quantidadeMovimentada) {
        await transaction.rollback();
        return res.status(400).json({ message: 'Saldo insuficiente em estoque.' });
      }
      produto.Quantidade -= parseInt(quantidadeMovimentada, 10);
    } else if (tipoMovimento === 'ENTRADA') {
      produto.Quantidade += parseInt(quantidadeMovimentada, 10);
    } else {
      await transaction.rollback();
      return res.status(400).json({ message: 'Tipo de movimento inválido. Use ENTRADA ou SAIDA.' });
    }

    await produto.save({ transaction });

    const novaCompra = await Compra.create({
      codUsuario: codUsuario,
      codProduto: codProduto,
      tipoMovimento: tipoMovimento,
      quantidadeMovimentada: quantidadeMovimentada,
      precoUnitario: precoUnitario,
      descontoAplicado: desconto,
      precoFinal: precoFinal,
      formaPagamento: formaPagamento,
      statusCompra: statusCompra,
      dataCompra: new Date()
    }, { transaction });

    await transaction.commit();

    const retornoFormatado = {
      ...novaCompra.toJSON(),
      tipoMovimento: novaCompra.tipoMovimento,
      quantidadeMovimentada: novaCompra.quantidadeMovimentada,
      status: novaCompra.statusCompra
    };

    res.status(201).json({ message: 'Compra registrada com sucesso!', dados: retornoFormatado });
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

    const dadosFormatados = dados.map(compra => {
      const c = compra.toJSON();
      return {
        ...c,
        tipoMovimento: c.tipoMovimento,
        quantidadeMovimentada: c.quantidadeMovimentada,
        status: c.statusCompra
      };
    });

    res.status(200).json(dadosFormatados);
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
    const c = dados.toJSON();
    const cFormatada = {
      ...c,
      tipoMovimento: c.tipoMovimento,
      quantidadeMovimentada: c.quantidadeMovimentada,
      status: c.statusCompra
    };
    res.status(200).json(cFormatada);
  } catch (err) {
    console.error('Não foi possível encontrar a compra', err);
    res.status(500).json({ message: 'Não foi possível encontrar a compra' });
  }
};

const relatorioProdutosCriticos = async (req, res) => {
  try {
    const results = await VwProdutosCriticos.findAll();
    res.status(200).json(results);
  } catch (err) {
    console.error('Erro ao buscar produtos críticos', err);
    res.status(500).json({ message: 'Erro ao buscar produtos críticos' });
  }
};

const relatorioVolumeCompras = async (req, res) => {
  try {
    const results = await VwVolumeCompras.findAll({
      order: [['valor_financeiro_movimentado', 'DESC']]
    });
    res.status(200).json(results);
  } catch (err) {
    console.error('Erro ao buscar volume de compras', err);
    res.status(500).json({ message: 'Erro ao buscar volume de compras' });
  }
};

const relatorioGraficos = async (req, res) => {
  try {
    const estoqueCritico = await VwProdutosCriticos.findAll();
    const volumeCompras = await VwVolumeCompras.findAll({
      limit: 5,
      order: [['valor_financeiro_movimentado', 'DESC']]
    });
    res.status(200).json({
      estoqueCritico,
      volumeCompras
    });
  } catch (err) {
    console.error('Erro ao gerar dados para gráficos', err);
    res.status(500).json({ message: 'Erro ao gerar dados para gráficos' });
  }
};

module.exports = { cadastrar, listar, buscarPorCod, relatorioProdutosCriticos, relatorioVolumeCompras, relatorioGraficos };