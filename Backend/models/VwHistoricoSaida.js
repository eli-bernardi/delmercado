const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/conn');

// Read-only model mapping to the database view vw_volume_compras (or VwHistoricoSaida)
const VwHistoricoSaida = sequelize.define('VwHistoricoSaida', {
  nome: {
    type: DataTypes.STRING,
    primaryKey: true // Sequelize requires a primary key, so we treat product name/ID as PK
  },
  quantidade_total_movimentada: {
    type: DataTypes.INTEGER
  },
  valor_financeiro_movimentado: {
    type: DataTypes.DECIMAL(15, 2)
  }
}, {
  tableName: 'vw_volume_compras', // maps to vw_volume_compras
  timestamps: false,
  freezeTableName: true
});

module.exports = VwHistoricoSaida;
