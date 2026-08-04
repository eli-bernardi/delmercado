const VwProdutosCriticos = require('../models/Vw_produtos_criticos')
const VwVolumeCompras = require('../models/Vw_volume_compras')

const listarPorCategorias = (req, res) => {
    VwVolumeCompras.findAll({
        order: [['valor_financeiro_movimentado', 'DESC']]
    })
        .then((dados) => {
            res.status(200).json(dados)
        })
        .catch((err) => {
            console.error('Não foi possível listar por Volume de Compras', err)
            res.status(500).json({ message: 'Não foi possível listar por Volume de Compras' })
        })
}

const listarHistoricoSaidas = (req, res) => {
    VwProdutosCriticos.findAll()
        .then((dados) => {
            res.status(200).json(dados)
        })
        .catch((err) => {
            console.error('Não foi possível listar os Produtos Críticos', err)
            res.status(500).json({ message: 'Não foi possível listar os Produtos Críticos' })
        })
}

module.exports = { listarPorCategorias, listarHistoricoSaidas }