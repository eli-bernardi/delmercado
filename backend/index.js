const express = require('express')
const app = express()
const cors = require('cors')

const conn = require('./db/conn')
const produtoController = require('./controller/produto.controller')
const usuarioController = require('./controller/usuario.controller')
const movimentoController = require('./controller/compra.controller')
const relatVwController = require('./controller/relatVW.controller')
const hostname = 'localhost' // 127.0.0.1
const PORT = 3000

// ------------ Middleware ----------
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())

// Inicializar as relações dos models
require('./models/rel')

//--------------- Rotas --------------

// Usuários
app.post('/usuario', usuarioController.cadastrar)
app.post('/usuarios', usuarioController.cadastrar)
app.get('/usuario', usuarioController.listar)
app.get('/usuarios', usuarioController.listar)
app.get('/usuario/buscar/:nome', usuarioController.buscarPorNome)
app.get('/usuarios/buscar/:nome', usuarioController.buscarPorNome)
app.post('/usuarios/bulk', usuarioController.bulkLoad)
app.get('/usuario/:id', usuarioController.buscarPorCod)
app.get('/usuarios/:id', usuarioController.buscarPorCod)
app.delete('/usuario/:id', usuarioController.excluir)
app.delete('/usuarios/:id', usuarioController.excluir)
app.put('/usuario/:id', usuarioController.atualizar)
app.put('/usuarios/:id', usuarioController.atualizar)

// Produtos
app.post('/produto', produtoController.cadastrar)
app.post('/produtos', produtoController.cadastrar)
app.get('/produto', produtoController.listar)
app.get('/produtos', produtoController.listar)
app.get('/produto/buscar/:nome', produtoController.buscarPorNome)
app.get('/produtos/buscar/:nome', produtoController.buscarPorNome)
app.post('/produtos/bulk', produtoController.bulkLoad)
app.get('/produto/:id', produtoController.buscarPorCod)
app.get('/produtos/:id', produtoController.buscarPorCod)
app.delete('/produto/:id', produtoController.excluir)
app.delete('/produtos/:id', produtoController.excluir)
app.put('/produto/:id', produtoController.atualizar)
app.put('/produtos/:id', produtoController.atualizar)

// Movimentações / Compras
app.post('/movimento', movimentoController.cadastrar)
app.post('/compras', movimentoController.cadastrar)
app.get('/movimentos', movimentoController.listar)
app.get('/compras', movimentoController.listar)

// Relatórios (Views) e Gráficos
app.get('/compras/relatorios/produtos-criticos', movimentoController.relatorioProdutosCriticos)
app.get('/compras/relatorios/volume-compras', movimentoController.relatorioVolumeCompras)
app.get('/compras/relatorios/graficos', movimentoController.relatorioGraficos)

// Rotas legadas de relatórios
app.get('/relatorio/categorias', relatVwController.listarPorCategorias)
app.get('/relatorio/saidas', relatVwController.listarHistoricoSaidas)

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Aplicação rodando!!!' })
})

// -------------- Server -------------
conn.sync()
  .then(() => {
    app.listen(PORT, hostname, () => {
      console.log(`Servidor rodando em http://${hostname}:${PORT}`)
    })
  })
  .catch((err) => {
    console.error('Erro de conexão com o banco de dados!', err)
  })