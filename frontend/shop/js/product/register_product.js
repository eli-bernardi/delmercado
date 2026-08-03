let resposta = document.getElementById('resposta')
let btn_cadastrar = document.getElementById('btn_cadastrar')

btn_cadastrar.addEventListener('click', (e) => {
    e.preventDefault()

    const nome = document.getElementById('nome').value
    const marca = document.getElementById('marca').value
    const descricao = document.getElementById('descricao').value
    const categoria = document.getElementById('categoria').value
    const preco = document.getElementById('preco').value
    const percentualDesconto = document.getElementById('percentualDesconto').value
    const quantidade = document.getElementById('quantidade').value
    const imagem = document.getElementById('imagem').value

    const produto = {
        nome: nome,
        marca: marca,
        descricao: descricao,
        categoria: categoria,
        preco: parseFloat(preco) || 0,
        percentualDesconto: parseFloat(percentualDesconto) || 0,
        quantidade: parseInt(quantidade) || 0,
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
            console.log(dados.message)
            resposta.innerHTML = ''
            resposta.innerHTML += `<p>${dados.message}</p>`
            document.querySelector('form').reset()
        })
        .catch((err) => {
            console.error('Erro ao cadastrar o produto', err)
            resposta.innerHTML = '<p>Erro ao tentar cadastrar o produto.</p>'
        })
})