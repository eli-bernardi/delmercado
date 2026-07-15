const { DataTypes } = require('sequelize')
const db = require('../db/conn')

const Compra = db.define('compra', {
  idCompra: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  codUsuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'usuarios',
      key: 'codUsuario'
    }
  },
  codProduto: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'produtos',
      key: 'codProduto'
    }
  },
  tipoMovimento: {
    type: DataTypes.ENUM('ENTRADA', 'SAIDA'),
    allowNull: false
  },
  quantidadeMovimentada: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  precoUnitario: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  descontoAplicado: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  precoFinal: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  formaPagamento: {
    type: DataTypes.ENUM('DINHEIRO', 'DEBITO', 'CREDITO'),
    allowNull: false
  },
  statusCompra: {
    type: DataTypes.ENUM('PAGA', 'PENDENTE'),
    allowNull: false
  },
  dataCompra: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  tableName: 'compras',
  timeStamps: false
})
module.exports = Compra