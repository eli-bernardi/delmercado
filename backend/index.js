const express = require('express')
const app = express()
const cors = require('cors')

const conn = require('./db/conn')
const produtoController = require('./controller/produto.controller')
const usuarioController = require('./controller/usuario.controller')
const compraController = require('./controller/compra.controller')
const relatVwController = require('./controller/relatVW.controller')
const hostname = 'localhost'
const PORT = 3000
// ------------ Middleware ----------
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(cors())

// Inicializar as relações dos models
require('./models/rel')

//--------------- Rotas --------------

// Usuários
app.post('/usuario', usuarioController.cadastrar)
app.get('/usuarios', usuarioController.listar)
app.get('/usuario/:id', usuarioController.buscarPorCod)
app.get('/usuario/buscar/:nome', usuarioController.buscarPorNome)
app.delete('/usuario/:id', usuarioController.excluir)
app.put('/usuario/:id', usuarioController.atualizar)
app.post('/usuarios/bulk', usuarioController.bulkLoad)

// Produtos
app.post('/produto', produtoController.cadastrar)
app.get('/produtos', produtoController.listar)
app.get('/produto/:id', produtoController.buscarPorCod)
app.get('/produto/buscar/:nome', produtoController.buscarPorNome)
app.delete('/produto/:id', produtoController.excluir)
app.put('/produto/:id', produtoController.atualizar)
app.post('/produtos/bulk', produtoController.bulkLoad)

// Compras
app.post('/compra', compraController.cadastrar)
app.get('/compras', compraController.listar)

// Relatórios (Views) e Gráficos
app.get('/compras/relatorios/produtos-criticos', compraController.relatorioProdutosCriticos)
app.get('/compras/relatorios/volume-compras', compraController.relatorioVolumeCompras)
app.get('/compras/relatorios/graficos', compraController.relatorioGraficos)

// Rotas legadas de relatórios
app.get('/relatorio/categorias', relatVwController.listarPorCategorias)
app.get('/relatorio/saidas', relatVwController.listarHistoricoSaidas)

app.get('/',(req,res)=>{
    res.status(200).json({message: 'Aplicação rodando!!!'})
})

// -------------- Server -------------
conn.sync()
.then(()=>{
    app.listen(PORT, hostname, ()=>{
        console.log(`Servidor rodando em http://${hostname}:${PORT}`)
    })
})
.catch((err)=>{
    console.error('Erro de conexão com o banco de dados!',err)
})