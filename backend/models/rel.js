const Usuario = require('./Usuario')
const Produto = require('./Produto')
const Compra = require('./Compra')

Usuario.hasMany(Compra, {
      foreignKey: 'idUsuario',
      as: 'compras',
      onDelete: 'CASCADE'
})

Compra.belongsTo(Usuario, {
      foreignKey: 'idUsuario',
      as: 'usuario',
      allowNull: false
})

Produto.hasMany(Compra, {
      foreignKey: 'idProduto',
      as: 'compras',
      onDelete: 'CASCADE'
})

Compra.belongsTo(Produto, {
      foreignKey: 'idProduto',
      as: 'produto',
      allowNull: false
})

module.exports = { Usuario, Produto, Compra }