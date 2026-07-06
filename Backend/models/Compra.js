const { DataTypes } = require('sequelize')
const db = require('../db/conn')

const Compra = db.define('compra', {
  codCompra: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  idUsuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'usuarios',
      key: 'codUsuario'
    }
  },
  idProduto: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'produtos',
      key: 'codProduto'
    }
  },
  tipo: {
    type: DataTypes.ENUM('ENTRADA', 'SAIDA'),
    allowNull: false
  },
  qtdeMov: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  precoUnit: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  descAplicado: {
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