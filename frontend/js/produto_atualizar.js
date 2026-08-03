const API = 'http://localhost:3000'
const resposta = document.getElementById('resposta')
const btn_carregar = document.getElementById('btn_carregar')
const btn_atualizar = document.getElementById('btn_atualizar')

btn_carregar.addEventListener('click', (e) => {
    e.preventDefault()

    const codProduto = document.getElementById('codProduto').value

    if (!codProduto) {
        mostrarToast('Por favor, informe o Código do Produto!', true)
        return
    }

    fetch(`${API}/produto/${codProduto}`)
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
            document.getElementById('percentualDesconto').value = prod.percentualDesconto || ''
            document.getElementById('quantidade').value = prod.quantidade || ''
            document.getElementById('imagem').value = prod.imagem || ''
            mostrarToast('Produto carregado com sucesso!', false)
        })
        .catch((err) => {
            console.error('Erro ao buscar o produto', err)
            mostrarToast('Produto não encontrado no banco de dados.', true)
        })
})

btn_atualizar.addEventListener('click', (e) => {
    e.preventDefault()

    const codProduto = document.getElementById('codProduto').value
    const nome = document.getElementById('nome').value
    const marca = document.getElementById('marca').value
    const descricao = document.getElementById('descricao').value
    const categoria = document.getElementById('categoria').value
    const preco = document.getElementById('preco').value
    const percentualDesconto = document.getElementById('percentualDesconto').value
    const quantidade = document.getElementById('quantidade').value
    const imagem = document.getElementById('imagem').value

    if (!codProduto) {
        mostrarToast('Por favor, informe o Código do Produto!', true)
        return
    }

    const produtoAtualizado = {
        nome: nome,
        marca: marca,
        descricao: descricao,
        categoria: categoria,
        preco: parseFloat(preco) || 0,
        percentualDesconto: parseFloat(percentualDesconto) || 0,
        quantidade: parseInt(quantidade) || 0,
        imagem: imagem
    }

    fetch(`${API}/produto/${codProduto}`, {
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
            mostrarToast(dados.message || 'Produto atualizado com sucesso!', false)
            document.getElementById('product-form').reset()
            document.getElementById('codProduto').value = ''
        })
        .catch((err) => {
            console.error('Erro ao atualizar os dados', err)
            mostrarToast('Erro ao tentar atualizar o produto.', true)
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
