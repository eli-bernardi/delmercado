const Usuario = require('./Usuario')
const Produto = require('./Produto')
const Compra = require('./Compra')

Usuario.hasMany(Compra,{
    foreignKey: 'codUsuario',
    as: 'compras',
    onDelete: 'CASCADE'
})

Compra.belongsTo(Usuario,{
    foreignKey: 'codUsuario',
    as: 'usuario',
    allowNull: false
})

Produto.hasMany(Compra,{
    foreignKey: 'codProduto',
    as: 'compras',
    onDelete: 'CASCADE'
})

Compra.belongsTo(Produto,{
    foreignKey: 'codProduto',
    as: 'produto',
    allowNull: false
})

module.exports = { Usuario, Produto, Compra }