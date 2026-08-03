const sequelize = require('../db/conn')
const Compra = require('../models/Compra')
const Produto = require('../models/Produto')
const Usuario = require('../models/Usuario')
const VwProdutosCriticos = require('../models/Vw_produtos_criticos')
const VwVolumeCompras = require('../models/Vw_volume_compras')

const cadastrar = async (req,res)=>{
    const valores = req.body

    if(!valores.codUsuario || !valores.codProduto || !valores.tipoMovimento || 
        !valores.quantidadeMovimentada || !valores.formaPagamento || !valores.statusCompra){
        return res.status(400).json({message: 'Campos obrigatórios: codUsuario, codProduto, tipoMovimento, quantidadeMovimentada, formaPagamento, statusCompra.'})
    }

    if(valores.quantidadeMovimentada <= 0){
        return res.status(400).json({message: 'Quantidade movimentada deve ser maior que zero.'})
    }

    const transaction = await sequelize.transaction()
    try{
        const usuario = await Usuario.findByPk(valores.codUsuario, { transaction })
        if(!usuario){
            await transaction.rollback()
            return res.status(404).json({message: 'Usuário não encontrado.'})
        }

        const produto = await Produto.findByPk(valores.codProduto, { transaction })
        if(!produto){
            await transaction.rollback()
            return res.status(404).json({message: 'Produto não encontrado.'})
        }

        const precoUnitario = parseFloat(produto.preco)
        const desconto = parseFloat(produto.percentualDesconto) || 0
        const precoFinal = (precoUnitario * (1 - desconto / 100)) * valores.quantidadeMovimentada

        if(valores.tipoMovimento === 'SAIDA'){
            if(produto.quantidade < valores.quantidadeMovimentada){
                await transaction.rollback()
                return res.status(400).json({message: 'Saldo insuficiente em estoque.'})
            }
            produto.quantidade -= parseInt(valores.quantidadeMovimentada, 10)
        }else if(valores.tipoMovimento === 'ENTRADA'){
            produto.quantidade += parseInt(valores.quantidadeMovimentada, 10)
        }else{
            await transaction.rollback()
            return res.status(400).json({message: 'Tipo de movimento inválido. Use ENTRADA ou SAIDA.'})
        }

        await produto.save({ transaction })

        const novaCompra = await Compra.create({
            codUsuario: valores.codUsuario,
            codProduto: valores.codProduto,
            tipoMovimento: valores.tipoMovimento,
            quantidadeMovimentada: valores.quantidadeMovimentada,
            precoUnitario: precoUnitario,
            descontoAplicado: desconto,
            precoFinal: precoFinal,
            formaPagamento: valores.formaPagamento,
            statusCompra: valores.statusCompra,
            dataCompra: new Date()
        }, { transaction })

        await transaction.commit()

        res.status(201).json({message: 'Compra registrada com sucesso!', dados: novaCompra})
    }catch(err){
        await transaction.rollback()
        console.error('Não foi possível registrar a compra',err)
        res.status(500).json({message: 'Não foi possível registrar a compra'})
    }
}

const listar = async (req,res)=>{
    try{
        const dados = await Compra.findAll({
            include: [
                { model: Usuario, as: 'usuario', attributes: ['nome','sobrenome'] },
                { model: Produto, as: 'produto', attributes: ['nome'] }
            ],
            order: [['dataCompra','DESC']]
        })
        res.status(200).json(dados)
    }catch(err){
        console.error('Não foi possível listar as compras',err)
        res.status(500).json({message: 'Não foi possível listar as compras'})
    }
}

const buscarPorCod = async (req,res)=>{
    const id = req.params.id
    try{
        const dados = await Compra.findByPk(id, {
            include: [
                { model: Usuario, as: 'usuario', attributes: ['nome','sobrenome'] },
                { model: Produto, as: 'produto', attributes: ['nome'] }
            ]
        })
        if(!dados){
            return res.status(404).json({message: 'Compra não encontrada!'})
        }
        res.status(200).json(dados)
    }catch(err){
        console.error('Não foi possível encontrar a compra',err)
        res.status(500).json({message: 'Não foi possível encontrar a compra'})
    }
}

const relatorioProdutosCriticos = async (req,res)=>{
    try{
        const dados = await VwProdutosCriticos.findAll()
        res.status(200).json(dados)
    }catch(err){
        console.error('Erro ao buscar produtos críticos',err)
        res.status(500).json({message: 'Erro ao buscar produtos críticos'})
    }
}

const relatorioVolumeCompras = async (req,res)=>{
    try{
        const dados = await VwVolumeCompras.findAll({
            order: [['valor_financeiro_movimentado','DESC']]
        })
        res.status(200).json(dados)
    }catch(err){
        console.error('Erro ao buscar volume de compras',err)
        res.status(500).json({message: 'Erro ao buscar volume de compras'})
    }
}

const relatorioGraficos = async (req,res)=>{
    try{
        const estoqueCritico = await VwProdutosCriticos.findAll()
        const volumeCompras = await VwVolumeCompras.findAll({
            limit: 5,
            order: [['valor_financeiro_movimentado','DESC']]
        })
        res.status(200).json({
            estoqueCritico,
            volumeCompras
        })
    }catch(err){
        console.error('Erro ao gerar dados para gráficos',err)
        res.status(500).json({message: 'Erro ao gerar dados para gráficos'})
    }
}

module.exports = { cadastrar, listar, buscarPorCod, relatorioProdutosCriticos, relatorioVolumeCompras, relatorioGraficos }