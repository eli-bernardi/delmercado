const API = 'http://localhost:3000'
const resposta = document.getElementById('resposta')
const btn_apagar = document.getElementById('btn_apagar')

btn_apagar.addEventListener('click', (e) => {
    e.preventDefault()

    const codUsuario = document.getElementById('codUsuario').value

    if (!codUsuario) {
        mostrarToast('Por favor, informe o Código do Usuário!', true)
        return
    }

    if (!confirm(`Deseja realmente apagar o usuário de ID ${codUsuario}?`)) {
        return
    }

    fetch(`${API}/usuario/${codUsuario}`, {
        method: 'DELETE'
    })
        .then(res => res.json())
        .then(dados => {
            mostrarToast(dados.message || 'Registro apagado com sucesso!', false)
            document.querySelector('form').reset()
        })
        .catch((err) => {
            console.error('Erro ao apagar os dados', err)
            mostrarToast('Erro ao tentar apagar o usuário.', true)
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
