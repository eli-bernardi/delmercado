const { DataTypes } = require('sequelize')
const db = require('../db/conn')

const Produto = db.define('produto', {
    codProduto: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Descricao: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Categoria: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Preco: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    PercentualDesconto: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    Quantidade: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    Marca: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Imagem: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'produtos',
    timeStamps: false
})
module.exports = Produto