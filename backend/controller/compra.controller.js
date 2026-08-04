const Usuario = require('../models/Usuario')
const Produto = require('../models/Produto')
const Compra = require('../models/Compra')
const VwProdutosCriticos = require('../models/Vw_produtos_criticos')
const VwVolumeCompras = require('../models/Vw_volume_compras')

const cadastrar = (req, res) => {
    const valores = req.body

    // Validação dos campos obrigatórios
    if (!valores.idUsuario || !valores.idProduto || !valores.tipoMovimento ||
        !valores.quantidadeMovimentada || !valores.formaPagamento ||
        !valores.statusCompra || !valores.dataCompra) {
        return res.status(400).json({ message: 'Todos os campos obrigatórios devem ser preenchidos!' })
    }

    // 1 - Verificar se o produto existe no banco
    Produto.findByPk(valores.idProduto)
        .then((produto) => {
            if (!produto) {
                return res.status(404).json({ message: 'Produto não encontrado!' })
            }

            // 2 - Verificar se o usuário existe no banco
            return Usuario.findByPk(valores.idUsuario)
                .then((usuario) => {
                    if (!usuario) {
                        return res.status(404).json({ message: 'Usuário não encontrado!' })
                    }

                    let novaQuantidade = produto.qtdeEstoque
                    const precoUnit = produto.preco // Recupera o preço atual direto do cadastro do produto

                    // Lógica de movimentação baseada no estoque atualizado
                    if (valores.tipoMovimento === 'ENTRADA') {
                        novaQuantidade += parseInt(valores.quantidadeMovimentada)
                    } else if (valores.tipoMovimento === 'SAIDA') {
                        if (produto.qtdeEstoque < valores.quantidadeMovimentada) {
                            return res.status(400).json({ message: 'Quantidade insuficiente no estoque para esta saída!' })
                        }
                        novaQuantidade -= parseInt(valores.quantidadeMovimentada)
                    } else {
                        return res.status(400).json({ message: 'Tipo de Movimentação Inválida! Use ENTRADA ou SAIDA.' })
                    }

                    // Cálculo do preço final aplicando o desconto percentual
                    const desconto = valores.descontoAplicado || produto.desconto || 0.00
                    const valorBruto = valores.quantidadeMovimentada * precoUnit
                    const valorDesconto = valorBruto * (desconto / 100)
                    const precoFinalCalculado = valorBruto - valorDesconto

                    // 3 - Atualiza o estoque do produto com a nova quantidade calculada
                    return produto.update({ qtdeEstoque: novaQuantidade })
                        .then(() => {
                            // 4 - Registra a compra na tabela
                            return Compra.create({
                                idUsuario: valores.idUsuario,
                                idProduto: valores.idProduto,
                                tipoMovimento: valores.tipoMovimento,
                                quantidadeMovimentada: valores.quantidadeMovimentada,
                                precoUnitario: precoUnit,
                                descontoAplicado: desconto,
                                precoFinal: precoFinalCalculado,
                                formaPagamento: valores.formaPagamento,
                                statusCompra: valores.statusCompra,
                                dataCompra: valores.dataCompra
                            })
                        })
                        .then((compra) => {
                            res.status(201).json(compra)
                        })
                })
        })
        .catch((err) => {
            console.error('Erro ao registrar a Compra:', err)
            res.status(500).json({ message: 'Erro ao registrar a Compra' })
        })
}

const listar = (req, res) => {
    Compra.findAll({
        include: [
            { model: Usuario, as: 'usuarioCompra', attributes: ['nome', 'sobrenome'] },
            { model: Produto, as: 'produtoCompra', attributes: ['nome'] }
        ],
        order: [['dataCompra', 'DESC']]
    })
        .then((dados) => {
            res.status(200).json(dados)
        })
        .catch((err) => {
            console.error('Não foi possível listar as compras', err)
            res.status(500).json({ message: 'Não foi possível listar as compras' })
        })
}

const buscarPorCod = (req, res) => {
    const id = req.params.id

    Compra.findByPk(id, {
        include: [
            { model: Usuario, as: 'usuarioCompra', attributes: ['nome', 'sobrenome'] },
            { model: Produto, as: 'produtoCompra', attributes: ['nome'] }
        ]
    })
        .then((dados) => {
            if (!dados) {
                return res.status(404).json({ message: 'Compra não encontrada!' })
            }
            res.status(200).json(dados)
        })
        .catch((err) => {
            console.error('Não foi possível encontrar a compra', err)
            res.status(500).json({ message: 'Não foi possível encontrar a compra' })
        })
}

const relatorioProdutosCriticos = (req, res) => {
    VwProdutosCriticos.findAll()
        .then((dados) => {
            res.status(200).json(dados)
        })
        .catch((err) => {
            console.error('Erro ao buscar produtos críticos', err)
            res.status(500).json({ message: 'Erro ao buscar produtos críticos' })
        })
}

const relatorioVolumeCompras = (req, res) => {
    VwVolumeCompras.findAll({
        order: [['valor_financeiro_movimentado', 'DESC']]
    })
        .then((dados) => {
            res.status(200).json(dados)
        })
        .catch((err) => {
            console.error('Erro ao buscar volume de compras', err)
            res.status(500).json({ message: 'Erro ao buscar volume de compras' })
        })
}

const relatorioGraficos = (req, res) => {
    let estoqueCritico = []
    let volumeCompras = []

    VwProdutosCriticos.findAll()
        .then((dados) => {
            estoqueCritico = dados
            return VwVolumeCompras.findAll({
                limit: 5,
                order: [['valor_financeiro_movimentado', 'DESC']]
            })
        })
        .then((dados) => {
            volumeCompras = dados
            res.status(200).json({ estoqueCritico, volumeCompras })
        })
        .catch((err) => {
            console.error('Erro ao gerar dados para gráficos', err)
            res.status(500).json({ message: 'Erro ao gerar dados para gráficos' })
        })
}

module.exports = { cadastrar, listar, buscarPorCod, relatorioProdutosCriticos, relatorioVolumeCompras, relatorioGraficos }