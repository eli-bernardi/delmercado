const API = 'http://localhost:3000'
const resposta = document.getElementById('resposta')
const btn_cadastrar = document.getElementById('btn_cadastrar')

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

    if(!nome || !marca || !descricao || !categoria || !preco || !percentualDesconto || !quantidade || !imagem) {
        mostrarToast('Por favor, preencha todos os campos obrigatórios!', true)
        return
    }

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

    fetch(`${API}/produto`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(produto)
    })
        .then(res => res.json())
        .then(dados => {
            mostrarToast(dados.message || 'Produto cadastrado com sucesso!', false)
            document.querySelector('form').reset()
        })
        .catch((err) => {
            console.error('Erro ao cadastrar o produto', err)
            mostrarToast('Erro ao tentar cadastrar o produto.', true)
        })
})

function mostrarToast(msg, erro = false) {
    if (!resposta) return
    resposta.textContent = msg
    resposta.className = `toast ${erro ? 'erro' : 'sucesso'}`
    resposta.style.display = 'block'
    clearTimeout(resposta._timeout)
    resposta._timeout = setTimeout(() => {
        resposta.style.display = 'none'
    }, 4500)
}
