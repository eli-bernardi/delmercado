const API = 'http://localhost:3000'
const resposta = document.getElementById('resposta')
const btn_apagar = document.getElementById('btn_apagar')

btn_apagar.addEventListener('click', (e) => {
    e.preventDefault()

    const codProduto = document.getElementById('codProduto').value

    if (!codProduto) {
        mostrarToast('Por favor, informe o Código do Produto!', true)
        return
    }

    if (!confirm(`Deseja realmente apagar o produto de ID ${codProduto}?`)) {
        return
    }

    fetch(`${API}/produto/${codProduto}`, {
        method: 'DELETE'
    })
        .then(res => res.json())
        .then(dados => {
            mostrarToast(dados.message || 'Registro apagado com sucesso!', false)
            document.querySelector('form').reset()
        })
        .catch((err) => {
            console.error('Erro ao apagar os dados', err)
            mostrarToast('Erro ao tentar apagar o produto.', true)
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
