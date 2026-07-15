const Produto = require('../models/Produto');

const cadastrar = async (req, res) => {
  const valores = req.body;
  if (!valores.nome || !valores.descricao || !valores.categoria || !valores.preco || !valores.percentualDesconto || !valores.quantidade || !valores.marca || !valores.imagem) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios!' })
  }

  try {
    await Produto.create({
      Nome, Descricao, Categoria, Preco, PercentualDesconto, Quantidade, Marca, Imagem
    })
    res.status(201).json({ message: 'Produto Cadastrado com sucesso!' })
  } catch (err) {
    console.error('Não foi possível cadastrar o Produto', err)
    res.status(500).json({ message: 'Não foi possível cadastrar o Produto' })
  }
}

const listar = async (req, res) => {
  try {
    const dados = await Produto.findAll()
    res.status(200).json(dados)
  } catch (err) {
    console.error('Não foi possível listar os Produtos', err)
    res.status(500).json({ message: 'Não foi possível listar os Produtos' })
  }
}

const buscarPorCod = async (req, res) => {
  const id = req.params.id
  try {
    const dados = await Produto.findByPk(id)
    if (!dados) {
      res.status(404).json({ message: 'Produto não encontrado!' })
    } else {
      res.status(200).json(dados)
    }
  } catch (err) {
    console.error('Não foi possível encontrar o Produto', err)
    res.status(500).json({ message: 'Não foi possível encontrar o Produto' })
  }
}

const buscarPorNome = async (req, res) => {
  const nome = req.params.nome
  try {
    const dados = await Produto.findOne({ where: { Nome: nome } })
    if (!dados) {
      res.status(404).json({ message: 'Nome do Produto não encontrado!' })
    } else {
      res.status(200).json(dados)
    }
  } catch (err) {
    console.error('Não foi possível encontrar o nome do Produto', err)
    res.status(500).json({ message: 'Não foi possível encontrar o nome do Produto' })
  }
}

const excluir = async (req, res) => {
  const id = req.params.id
  try {
    const dados = await Produto.findByPk(id)
    if (!dados) {
      res.status(404).json({ message: 'Produto não encontrado no banco de dados!' })
    } else {
      await Produto.destroy({ where: { codProduto: id } })
      res.status(200).json({ message: 'Produto excluído com sucesso!' })
    }
  } catch (err) {
    console.error('Não foi possível excluir o Produto', err)
    res.status(500).json({ message: 'Não foi possível excluir o Produto' })
  }
}

const atualizar = async (req, res) => {
  const id = req.params.id
  const valores = req.body

  const Nome = valores.Nome || valores.nome || valores.title;
  const Descricao = valores.Descricao || valores.descricao || valores.description;
  const Categoria = valores.Categoria || valores.categoria || valores.category;
  const Preco = valores.Preco !== undefined ? valores.Preco : (valores.preco !== undefined ? valores.preco : valores.precoUnit);
  const PercentualDesconto = valores.PercentualDesconto !== undefined ? valores.PercentualDesconto : (valores.percentualDesconto !== undefined ? valores.percentualDesconto : valores.discountPercentage);
  const Quantidade = valores.Quantidade !== undefined ? valores.Quantidade : (valores.quantidade !== undefined ? valores.quantidade : valores.stock);
  const Marca = valores.Marca || valores.marca || valores.brand;
  const Imagem = valores.Imagem || valores.imagem || valores.thumbnail;

  try {
    let dados = await Produto.findByPk(id)
    if (!dados) {
      res.status(404).json({ message: 'Produto não encontrado no banco de dados!' })
    } else {
      await Produto.update({
        Nome, Descricao, Categoria, Preco, PercentualDesconto, Quantidade, Marca, Imagem
      }, { where: { codProduto: id } })
      dados = await Produto.findByPk(id)
      res.status(200).json(dados)
    }
  } catch (err) {
    console.error('Não foi possível atualizar o Produto', err)
    res.status(500).json({ message: 'Não foi possível atualizar o Produto' })
  }
}

const bulkLoad = async (req, res) => {
  try {
    const response = await fetch('https://dummyjson.com/products?limit=50');
    if (!response.ok) {
      throw new Error(`DummyJSON returned status ${response.status}`);
    }
    const data = await response.json();
    const productsToInsert = data.products.map(p => ({
      codProduto: p.id,
      Nome: p.title,
      Descricao: p.description,
      Categoria: p.category,
      Preco: p.price,
      PercentualDesconto: p.discountPercentage,
      Quantidade: p.stock,
      Marca: p.brand || 'Sem marca',
      Imagem: p.thumbnail
    }));
    const result = await Produto.bulkCreate(productsToInsert, {
      updateOnDuplicate: ['Nome', 'Descricao', 'Categoria', 'Preco', 'PercentualDesconto', 'Quantidade', 'Marca', 'Imagem']
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