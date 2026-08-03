const API = 'http://localhost:3000'
const resposta = document.getElementById('resposta')
const btn_carregar = document.getElementById('btn_carregar')
const btn_atualizar = document.getElementById('btn_atualizar')

btn_carregar.addEventListener('click', (e) => {
    e.preventDefault()

    const codUsuario = document.getElementById('codUsuario').value

    if (!codUsuario) {
        mostrarToast('Por favor, informe o Código do Usuário!', true)
        return
    }

    fetch(`${API}/usuario/${codUsuario}`)
        .then(res => {
            if (!res.ok) {
                throw new Error('Usuário não encontrado!')
            }
            return res.json()
        })
        .then(user => {
            document.getElementById('nome').value = user.nome || ''
            document.getElementById('sobrenome').value = user.sobrenome || ''
            document.getElementById('idade').value = user.idade || ''
            document.getElementById('email').value = user.email || ''
            document.getElementById('telefone').value = user.telefone || ''
            document.getElementById('endereco').value = user.endereco || ''
            document.getElementById('cidade').value = user.cidade || ''
            document.getElementById('estado').value = user.estado || ''
            mostrarToast('Usuário carregado com sucesso!', false)
        })
        .catch((err) => {
            console.error('Erro ao buscar o usuário', err)
            mostrarToast('Usuário não encontrado no banco de dados.', true)
        })
})

btn_atualizar.addEventListener('click', (e) => {
    e.preventDefault()

    const codUsuario = document.getElementById('codUsuario').value
    const nome = document.getElementById('nome').value
    const sobrenome = document.getElementById('sobrenome').value
    const idade = document.getElementById('idade').value
    const email = document.getElementById('email').value
    const telefone = document.getElementById('telefone').value
    const endereco = document.getElementById('endereco').value
    const cidade = document.getElementById('cidade').value
    const estado = document.getElementById('estado').value

    if (!codUsuario) {
        mostrarToast('Por favor, informe o Código do Usuário!', true)
        return
    }

    const usuarioAtualizado = {
        nome: nome,
        sobrenome: sobrenome,
        idade: parseInt(idade) || 0,
        email: email,
        telefone: telefone,
        endereco: endereco,
        cidade: cidade,
        estado: estado
    }

    fetch(`${API}/usuario/${codUsuario}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(usuarioAtualizado)
    })
        .then(res => {
            if (!res.ok) {
                throw new Error('Erro ao atualizar usuário.')
            }
            return res.json()
        })
        .then(dados => {
            mostrarToast(dados.message || 'Usuário atualizado com sucesso!', false)
            document.getElementById('user-form').reset()
            document.getElementById('codUsuario').value = ''
        })
        .catch((err) => {
            console.error('Erro ao atualizar os dados', err)
            mostrarToast('Erro ao tentar atualizar o usuário.', true)
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
