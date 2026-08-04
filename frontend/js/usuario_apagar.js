let resposta = document.getElementById('resposta')
let btn_apagar = document.getElementById('btn_apagar')

btn_apagar.addEventListener('click', (e) => {
    e.preventDefault()

    let codUsuario = document.getElementById('codUsuario').value

    if (!codUsuario) {
        resposta.innerHTML = '<p style="color: #ffaa00;">Por favor, informe o Código do Usuário!</p>'
        return
    }

    if (!confirm(`Deseja realmente apagar o usuário de ID ${codUsuario}?`)) {
        return
    }

    fetch(`http://localhost:3000/usuario/${codUsuario}`, {
        method: 'DELETE'
    })
        .then(res => res.json())
        .then(dados => {
            resposta.innerHTML = `<p style="color: lightgreen;">${dados.message || 'Registro apagado com sucesso!'}</p>`
            document.querySelector('form').reset()
        })
        .catch((err) => {
            console.error('Erro ao apagar os dados', err)
            resposta.innerHTML = '<p style="color: red;">Erro ao tentar apagar o usuário.</p>'
        })
})
