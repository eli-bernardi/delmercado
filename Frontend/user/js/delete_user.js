let resposta = document.getElementById('resposta')
let btn_apagar = document.getElementById('btn_apagar')

btn_apagar.addEventListener('click', (e) => {
    e.preventDefault()
    
    const codUsuario = document.getElementById('codUsuario').value

    if (!codUsuario) {
        resposta.innerHTML = '<p>Por favor, informe o Código do Usuário!</p>'
        return
    }

    fetch(`http://localhost:3000/usuarios/${codUsuario}`, {
        method: 'DELETE'
    })
    .then(res => {
        if (!res.ok) {
            return res.json().then(err => { throw new Error(err.message || 'Erro ao excluir') })
        }
        return res.json()
    })
    .then(dados => {
        console.log(dados.message)
        resposta.innerHTML = ''
        resposta.innerHTML += `<p>${dados.message}</p>`
        document.querySelector('form').reset()
    })
    .catch((err) => {
        console.error('Erro ao apagar os dados', err)
        resposta.innerHTML = `<p>${err.message || 'Erro ao tentar apagar o registro.'}</p>`
    })
})