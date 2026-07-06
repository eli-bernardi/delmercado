const Produto = require('../models/Produto');

const cadastrar = async (req, res) => {
  const valores = req.body;
  if (!valores.nome || !valores.descricao || !valores.categoria || !valores.preco || !valores.percentualDesconto || !valores.quantidade || !valores.marca || !valores.imagem) {
    return res.status(400).json({ message: 'Campos obrigatórios: Nome, Categoria, Quantidade, Preço.' });
  }
  try {
    await Produto.create(valores);
    res.status(201).json({ message: 'Produto Cadastrado com sucesso!' });
  } catch (err) {
    console.error('Não foi possível cadastrar o Produto', err);
    res.status(500).json({ message: 'Não foi possível cadastrar o Produto' });
  }
};

const listar = async (req, res) => {
  try {
    const dados = await Produto.findAll();
    res.status(200).json(dados);
  } catch (err) {
    console.error('Não foi possível listar os Produtos', err);
    res.status(500).json({ message: 'Não foi possível listar os Produtos' });
  }
};

const buscarPorCod = async (req, res) => {
  const id = req.params.id;
  try {
    const dados = await Produto.findByPk(id);
    if (!dados) {
      return res.status(404).json({ message: 'Produto não encontrado!' });
    }
    res.status(200).json(dados);
  } catch (err) {
    console.error('Não foi possível encontrar o Produto', err);
    res.status(500).json({ message: 'Não foi possível encontrar o Produto' });
  }
};

const buscarPorNome = async (req, res) => {
  const nome = req.params.nome;
  try {
    const dados = await Produto.findOne({ where: { Nome: nome } });
    if (!dados) {
      return res.status(404).json({ message: 'Nome do Produto não encontrado!' });
    }
    res.status(200).json(dados);
  } catch (err) {
    console.error('Não foi possível encontrar o nome do Produto', err);
    res.status(500).json({ message: 'Não foi possível encontrar o nome do Produto' });
  }
};

const excluir = async (req, res) => {
  const id = req.params.id;
  try {
    const produto = await Produto.findByPk(id);
    if (!produto) {
      return res.status(404).json({ message: 'Produto não encontrado no banco de dados!' });
    }
    await Produto.destroy({ where: { codProduto: id } });
    res.status(200).json({ message: 'Produto excluído com sucesso!' });
  } catch (err) {
    console.error('Não foi possível excluir o Produto', err);
    res.status(500).json({ message: 'Não foi possível excluir o Produto' });
  }
};

const atualizar = async (req, res) => {
  const id = req.params.id;
  const valores = req.body;
  try {
    const produto = await Produto.findByPk(id);
    if (!produto) {
      return res.status(404).json({ message: 'Produto não encontrado no banco de dados!' });
    }
    await Produto.update(valores, { where: { codProduto: id } });
    const atualizado = await Produto.findByPk(id);
    res.status(200).json(atualizado);
  } catch (err) {
    console.error('Não foi possível atualizar o Produto', err);
    res.status(500).json({ message: 'Não foi possível atualizar o Produto' });
  }
};

const bulkLoad = async (req, res) => {
  try {
    const response = await fetch('https://dummyjson.com/products?limit=50');
    if (!response.ok) {
      throw new Error(`DummyJSON returned status ${response.status}`);
    }
    const data = await response.json();
    const productsToInsert = data.products.map(p => ({
      codProduto: p.id,
      nome: p.title,
      descricao: p.description,
      categoria: p.category,
      preco: p.price,
      percentualDesconto: p.discountPercentage,
      quantidade: p.stock,
      marca: p.brand,
      imagem: p.thumbnail
    }));
    const result = await Produto.bulkCreate(productsToInsert, {
      updateOnDuplicate: ['nome', 'descricao', 'categoria', 'preco', 'percentualDesconto', 'quantidade', 'marca', 'imagem']
    });
    res.status(200).json({
      message: `${result.length} produtos carregados com sucesso em lote.`,
      count: result.length
    });
  } catch (error) {
    console.error('Erro no carregamento em lote', error);
    res.status(500).json({ message: 'Erro no carregamento em lote', error: error.message });
  }
};

module.exports = { cadastrar, listar, buscarPorCod, buscarPorNome, excluir, atualizar, bulkLoad };   