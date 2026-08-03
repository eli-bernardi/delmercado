const API = 'http://localhost:3000'
const resposta = document.getElementById('resposta')
const btn_consultar = document.getElementById('btn_consultar')
const btn_consultar_nome = document.getElementById('btn_consultar_nome')
const resposta_tabela = document.getElementById('resposta_tabela')

btn_consultar.addEventListener('click', (e) => {
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
        .then(dados => {
            resposta_tabela.innerHTML = criarTbody([dados])
        })
        .catch((err) => {
            console.error('Erro ao consultar os dados', err)
            resposta_tabela.innerHTML = `<tr><td colspan="9" style="text-align: center; color: #f87171;">Usuário não encontrado.</td></tr>`
            mostrarToast('Usuário não encontrado.', true)
        })
})

btn_consultar_nome.addEventListener('click', (e) => {
    e.preventDefault()

    const nome = document.getElementById('nome').value

    if (!nome) {
        mostrarToast('Por favor, informe o Nome do Usuário!', true)
        return
    }

    fetch(`${API}/usuario/buscar/${nome}`)
        .then(res => {
            if (!res.ok) {
                throw new Error('Usuário não encontrado!')
            }
            return res.json()
        })
        .then(dados => {
            resposta_tabela.innerHTML = criarTbody([dados])
        })
        .catch((err) => {
            console.error('Erro ao consultar os dados', err)
            resposta_tabela.innerHTML = `<tr><td colspan="9" style="text-align: center; color: #f87171;">Usuário não encontrado.</td></tr>`
            mostrarToast('Usuário não encontrado.', true)
        })
})

function criarTbody(dados) {
    let corpo = ''
    dados.forEach(el => {
        corpo += `<tr>`
        corpo += `<td>${el.codUsuario}</td>`
        corpo += `<td>${el.nome}</td>`
        corpo += `<td>${el.sobrenome}</td>`
        corpo += `<td>${el.idade}</td>`
        corpo += `<td>${el.email}</td>`
        corpo += `<td>${el.telefone || '-'}</td>`
        corpo += `<td>${el.endereco || '-'}</td>`
        corpo += `<td>${el.cidade || '-'}</td>`
        corpo += `<td>${el.estado || '-'}</td>`
        corpo += `</tr>`
    })
    return corpo
}

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
