const { DataTypes } = require('sequelize')
const db = require('../db/conn')

const Usuario = db.define('usuario', {
    codUsuario: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Sobrenome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Idade: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    Email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Telefone: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Endereco: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Cidade: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Estado: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'usuarios',
    timeStamps: false
})

module.exports = Usuario