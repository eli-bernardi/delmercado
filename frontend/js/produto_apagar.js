let resposta = document.getElementById('resposta')
let btn_apagar = document.getElementById('btn_apagar')

btn_apagar.addEventListener('click', (e) => {
    e.preventDefault()

    let codProduto = document.getElementById('codProduto').value

    if (!codProduto) {
        resposta.innerHTML = '<p style="color: #ffaa00;">Por favor, informe o Código do Produto!</p>'
        return
    }

    if (!confirm(`Deseja realmente apagar o produto de ID ${codProduto}?`)) {
        return
    }

    fetch(`http://localhost:3000/produto/${codProduto}`, {
        method: 'DELETE'
    })
    .then(res => res.json())
    .then(dados => {
        resposta.innerHTML = `<p style="color: lightgreen;">${dados.message || 'Registro apagado com sucesso!'}</p>`
        document.querySelector('form').reset()
    })
    .catch((err) => {
        console.error('Erro ao apagar os dados', err)
        resposta.innerHTML = '<p style="color: red;">Erro ao tentar apagar o produto.</p>'
    })
})
