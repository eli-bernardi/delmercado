const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { sequelize, initializeDatabase } = require('./db/conn');
const Usuario = require('./models/Usuario');
const Produto = require('./models/Produto');
const Compra = require('./models/Compra');

// Controllers
const usuarioController = require('./controller/usuario.controller');
const produtoController = require('./controller/produto.controller');
const compraController = require('./controller/compra.controller');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
// 1. Users CRUD and Bulk
app.get('/usuarios', usuarioController.getAll);
app.get('/usuarios/:id', usuarioController.getById);
app.post('/usuarios', usuarioController.create);
app.put('/usuarios/:id', usuarioController.update);
app.delete('/usuarios/:id', usuarioController.delete);
app.post('/usuarios/bulk', usuarioController.bulkLoad);

// 2. Products CRUD and Bulk
app.get('/produtos', produtoController.getAll);
app.get('/produtos/:id', produtoController.getById);
app.post('/produtos', produtoController.create);
app.put('/produtos/:id', produtoController.update);
app.delete('/produtos/:id', produtoController.delete);
app.post('/produtos/bulk', produtoController.bulkLoad);

// 3. Purchase Movements and Reports
app.post('/compras', compraController.create);
app.get('/compras', compraController.getAll);
app.get('/compras/relatorios/produtos-criticos', compraController.getProdutosCriticos);
app.get('/compras/relatorios/volume-compras', compraController.getVolumeCompras);
app.get('/compras/relatorios/graficos', compraController.getGraficos);

// Server status endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    message: 'Sistema de Compras Interno Del Mercado API online e funcionando.'
  });
});

async function createViews() {
  try {
    // 1. vw_produtos_criticos
    await sequelize.query(`
      CREATE OR REPLACE VIEW vw_produtos_criticos AS 
      SELECT 
        codProduto AS codigo_produto, 
        Nome AS nome, 
        Categoria AS categoria, 
        Quantidade AS quantidade_atual 
      FROM produtos 
      WHERE Quantidade < 10;
    `);

    // 2. vw_volume_compras
    await sequelize.query(`
      CREATE OR REPLACE VIEW vw_volume_compras AS 
      SELECT 
        p.Nome AS nome, 
        SUM(c.quantidadeMovimentada) AS quantidade_total_movimentada, 
        SUM(c.quantidadeMovimentada * c.precoUnitario) AS valor_financeiro_movimentado 
      FROM compras c 
      JOIN produtos p ON c.codProduto = p.codProduto 
      WHERE c.tipoMovimento = 'SAIDA' 
      GROUP BY p.codProduto, p.Nome;
    `);
    
    console.log('Database views initialized successfully.');
  } catch (error) {
    console.error('Error initializing database views:', error.message);
  }
}

async function startServer() {
  // Check/create database db_compras first using standard mysql connection
  await initializeDatabase();

  // Sync models
  try {
    await sequelize.sync({ force: false });
    console.log('Database tables synced successfully.');
    
    // Create view definitions in DB
    await createViews();
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database or sync tables:', error);
  }
}

startServer();
