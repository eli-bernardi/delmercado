let resposta = document.getElementById('resposta')
let btn_cadastrar = document.getElementById('btn_cadastrar')
let btn_carga_lote = document.getElementById('btn_carga_lote')

// =========================================================================
// COMPORTAMENTO 1: CADASTRO MANUAL
// =========================================================================
btn_cadastrar.addEventListener('click', (e) => {
    e.preventDefault()

    let nome = document.getElementById('nome').value
    let marca = document.getElementById('marca').value
    let descricao = document.getElementById('descricao').value
    let categoria = document.getElementById('categoria').value
    let preco = document.getElementById('preco').value
    let desconto = document.getElementById('desconto').value
    let qtdeEstoque = document.getElementById('qtdeEstoque').value
    let imagem = document.getElementById('imagem').value

    if (!nome || !marca || !descricao || !categoria || !preco || !qtdeEstoque || !imagem) {
        resposta.innerHTML = '<p style="color: #ffaa00;">Por favor, preencha todos os campos obrigatórios!</p>'
        return
    }

    let produto = {
        nome: nome,
        marca: marca,
        descricao: descricao,
        categoria: categoria,
        preco: parseFloat(preco) || 0,
        desconto: parseFloat(desconto) || 0,
        qtdeEstoque: parseInt(qtdeEstoque) || 0,
        imagem: imagem
    }

    fetch('http://localhost:3000/produto', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(produto)
    })
    .then(res => res.json())
    .then(dados => {
        resposta.innerHTML = `<p style="color: lightgreen;">${dados.message || 'Produto cadastrado com sucesso!'}</p>`
        document.querySelector('form').reset()
    })
    .catch((err) => {
        console.error('Erro ao cadastrar o produto', err)
        resposta.innerHTML = '<p style="color: red;">Erro ao tentar cadastrar o produto.</p>'
    })
})

// =========================================================================
// COMPORTAMENTO 2: CADASTRO EM LOTE (BULKCREATE VIA DUMMYJSON)
// =========================================================================
btn_carga_lote.addEventListener('click', (e) => {
    e.preventDefault()
    resposta.innerHTML = '<p style="color: yellow;">Buscando catálogos de produtos na API DummyJSON...</p>'

    // 1. Consome os dados da API pública externa de produtos
    fetch('https://dummyjson.com/products')
    .then(res => res.json())
    .then(dadosExternos => {
        resposta.innerHTML = '<p style="color: cyan;">Dados recebidos com sucesso! Transmitindo lote para o back-end...</p>'

        // 2. Transmite o array (.products) diretamente para o backend local
        return fetch('http://localhost:3000/produtos/bulk', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dadosExternos.products)
        })
    })
    .then(res => res.json())
    .then(dados => {
        resposta.innerHTML = `<p style="color: lightgreen;">${dados.message || 'Carga estrutural de produtos realizada com sucesso!'}</p>`
    })
    .catch(err => {
        console.error('Erro na carga em lote de produtos:', err)
        resposta.innerHTML = '<p style="color: red;">Falha ao processar os dados da carga de produtos em lote.</p>'
    })
})
