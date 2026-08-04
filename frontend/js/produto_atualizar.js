let resposta = document.getElementById('resposta')
let btn_carregar = document.getElementById('btn_carregar')
let btn_atualizar = document.getElementById('btn_atualizar')

btn_carregar.addEventListener('click', (e) => {
    e.preventDefault()

    let codProduto = document.getElementById('codProduto').value

    if (!codProduto) {
        resposta.innerHTML = '<p style="color: #ffaa00;">Por favor, informe o Código do Produto!</p>'
        return
    }

    fetch(`http://localhost:3000/produto/${codProduto}`)
    .then(res => {
        if (!res.ok) {
            throw new Error('Produto não encontrado!')
        }
        return res.json()
    })
    .then(prod => {
        document.getElementById('nome').value = prod.nome || ''
        document.getElementById('marca').value = prod.marca || ''
        document.getElementById('descricao').value = prod.descricao || ''
        document.getElementById('categoria').value = prod.categoria || ''
        document.getElementById('preco').value = prod.preco || ''
        document.getElementById('desconto').value = prod.desconto || ''
        document.getElementById('qtdeEstoque').value = prod.qtdeEstoque || ''
        document.getElementById('imagem').value = prod.imagem || ''
        resposta.innerHTML = '<p style="color: lightgreen;">Produto carregado com sucesso!</p>'
    })
    .catch((err) => {
        console.error('Erro ao buscar o produto', err)
        resposta.innerHTML = '<p style="color: red;">Produto não encontrado no banco de dados.</p>'
    })
})

btn_atualizar.addEventListener('click', (e) => {
    e.preventDefault()

    let codProduto = document.getElementById('codProduto').value
    let nome = document.getElementById('nome').value
    let marca = document.getElementById('marca').value
    let descricao = document.getElementById('descricao').value
    let categoria = document.getElementById('categoria').value
    let preco = document.getElementById('preco').value
    let desconto = document.getElementById('desconto').value
    let qtdeEstoque = document.getElementById('qtdeEstoque').value
    let imagem = document.getElementById('imagem').value

    if (!codProduto) {
        resposta.innerHTML = '<p style="color: #ffaa00;">Por favor, informe o Código do Produto!</p>'
        return
    }

    let produtoAtualizado = {
        nome: nome,
        marca: marca,
        descricao: descricao,
        categoria: categoria,
        preco: parseFloat(preco) || 0,
        desconto: parseFloat(desconto) || 0,
        qtdeEstoque: parseInt(qtdeEstoque) || 0,
        imagem: imagem
    }

    fetch(`http://localhost:3000/produto/${codProduto}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(produtoAtualizado)
    })
    .then(res => {
        if (!res.ok) {
            throw new Error('Erro ao atualizar produto.')
        }
        return res.json()
    })
    .then(dados => {
        resposta.innerHTML = `<p style="color: lightgreen;">${dados.message || 'Produto atualizado com sucesso!'}</p>`
        document.getElementById('product-form').reset()
        document.getElementById('codProduto').value = ''
    })
    .catch((err) => {
        console.error('Erro ao atualizar os dados', err)
        resposta.innerHTML = '<p style="color: red;">Erro ao tentar atualizar o produto.</p>'
    })
})
