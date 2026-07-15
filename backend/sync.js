const conn = require('./db/conn')
const { Usuario, Produto, Compra } = require('./models/rel')

async function syncDataBase(){
    try{
        await conn.sync({force: true})
        console.log('Tabelas sincronizadas')

        // Injetar a criação da view vw_produtos_criticos
        const queryViewCriticos = `
            CREATE OR REPLACE VIEW vw_produtos_criticos AS
            SELECT
                codProduto AS codigo_produto,
                Nome AS nome,
                Categoria AS categoria,
                Quantidade AS quantidade_atual
            FROM produtos
            WHERE Quantidade < 10;
        `
        await conn.query(queryViewCriticos)
        console.log('view vw_produtos_criticos criada com sucesso!')

        // Injetar a criação da view vw_volume_compras
        const queryViewVolume = `
            CREATE OR REPLACE VIEW vw_volume_compras AS
            SELECT
                p.Nome AS nome,
                SUM(c.quantidadeMovimentada) AS quantidade_total_movimentada,
                SUM(c.quantidadeMovimentada * c.precoUnitario) AS valor_financeiro_movimentado
            FROM compras c
            INNER JOIN produtos p ON c.codProduto = p.codProduto
            WHERE c.tipoMovimento = 'SAIDA'
            GROUP BY p.codProduto, p.Nome;
        `
        await conn.query(queryViewVolume)
        console.log('view vw_volume_compras criada com sucesso!')
    }catch(err){
        console.error('Erro ao sincronizar as tabelas',err)
    }finally{
        await conn.close()
        console.log('Fechando a conexão com o banco de dados') 
    }
}

syncDataBase()