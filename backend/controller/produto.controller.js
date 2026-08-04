const Produto = require('../models/Produto')

const cadastrar = (req, res) => {
    const valores = req.body

    if (!valores.nome || !valores.descricao || !valores.categoria ||
        !valores.preco || !valores.desconto || !valores.qtdeEstoque ||
        !valores.marca || !valores.imagem) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios!' })
    }

    Produto.create(valores)
        .then(() => {
            res.status(201).json({ message: 'Produto Cadastrado com sucesso!' })
        })
        .catch((err) => {
            console.error('Não foi possível cadastrar o Produto', err)
            res.status(500).json({ message: 'Não foi possível cadastrar o Produto' })
        })
}

const listar = (req, res) => {
    Produto.findAll()
        .then((dados) => {
            res.status(200).json(dados)
        })
        .catch((err) => {
            console.error('Não foi possível listar os Produtos', err)
            res.status(500).json({ message: 'Não foi possível listar os Produtos' })
        })
}

const buscarPorCod = (req, res) => {
    const id = req.params.id

    Produto.findByPk(id)
        .then((dados) => {
            if (!dados) {
                res.status(404).json({ message: 'Produto não encontrado!' })
            } else {
                res.status(200).json(dados)
            }
        })
        .catch((err) => {
            console.error('Não foi possível encontrar o Produto', err)
            res.status(500).json({ message: 'Não foi possível encontrar o Produto' })
        })
}

const buscarPorNome = (req, res) => {
    const nome = req.params.nome

    Produto.findOne({ where: { nome: nome } })
        .then((dados) => {
            if (!dados) {
                res.status(404).json({ message: 'Nome do Produto não encontrado!' })
            } else {
                res.status(200).json(dados)
            }
        })
        .catch((err) => {
            console.error('Não foi possível encontrar o nome do Produto', err)
            res.status(500).json({ message: 'Não foi possível encontrar o nome do Produto' })
        })
}

const excluir = (req, res) => {
    const id = req.params.id

    Produto.findByPk(id)
        .then((dados) => {
            if (!dados) {
                res.status(404).json({ message: 'Produto não encontrado no banco de dados!' })
            } else {
                return Produto.destroy({ where: { codProduto: id } })
                    .then(() => {
                        res.status(200).json({ message: 'Produto excluído com sucesso!' })
                    })
            }
        })
        .catch((err) => {
            console.error('Não foi possível excluir o Produto', err)
            res.status(500).json({ message: 'Não foi possível excluir o Produto' })
        })
}

const atualizar = (req, res) => {
    const id = req.params.id
    const valores = req.body

    Produto.findByPk(id)
        .then((dados) => {
            if (!dados) {
                res.status(404).json({ message: 'Produto não encontrado no banco de dados!' })
            } else {
                return Produto.update(valores, { where: { codProduto: id } })
                    .then(() => {
                        return Produto.findByPk(id)
                    })
                    .then((dadosAtualizados) => {
                        res.status(200).json(dadosAtualizados)
                    })
            }
        })
        .catch((err) => {
            console.error('Não foi possível atualizar o Produto', err)
            res.status(500).json({ message: 'Não foi possível atualizar o Produto' })
        })
}

// Operação de Carga Inicial em Lote
const bulkLoad = (req, res) => {
    const listaProdutos = req.body

    if (!listaProdutos || listaProdutos.length === 0) {
        return res.status(400).json({ message: 'Nenhum dado válido foi enviado para a carga em lote!' })
    }

    const produtosMapeados = []

    for (let i = 0; i < listaProdutos.length; i++) {
        const item = listaProdutos[i]

        produtosMapeados.push({
            nome: item.nome || item.title,
            descricao: item.descricao || item.description,
            categoria: item.categoria || item.category,
            preco: item.preco || item.price,
            desconto: item.desconto || item.discountPercentage,
            qtdeEstoque: item.qtdeEstoque || item.stock,
            marca: item.marca || item.brand,
            imagem: item.imagem || item.thumbnail
        })
    }

    Produto.bulkCreate(produtosMapeados)
        .then(() => {
            res.status(201).json({ message: 'Carga em lote de produtos realizada com sucesso no banco!' })
        })
        .catch((err) => {
            console.error('Erro no bulkCreate de produtos:', err)
            res.status(500).json({ message: 'Erro ao salvar os produtos em lote no banco de dados' })
        })
}

module.exports = { cadastrar, listar, buscarPorCod, buscarPorNome, excluir, atualizar, bulkLoad }