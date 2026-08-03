const API = 'http://localhost:3000'
const resposta = document.getElementById('resposta')
const btn_listar = document.getElementById('btn_listar')
const resposta_tabela = document.getElementById('resposta_tabela')
const spinner = document.getElementById('table-spinner')

btn_listar.addEventListener('click', (e) => {
    e.preventDefault()
    carregarLista()
})

async function carregarLista() {
    if (spinner) spinner.classList.remove('oculto')
    if (resposta_tabela) resposta_tabela.innerHTML = ''

    fetch(`${API}/usuarios`)
        .then(res => res.json())
        .then(dados => {
            if (spinner) spinner.classList.add('oculto')
            if (resposta_tabela) {
                resposta_tabela.innerHTML = criarTbody(dados)
            }
        })
        .catch((err) => {
            console.error('Erro ao listar os dados', err)
            if (spinner) spinner.classList.add('oculto')
            mostrarToast('Erro ao tentar listar os usuários.', true)
        })
}

function criarTbody(dados) {
    if (dados.length === 0) {
        return `<tr><td colspan="9" style="text-align: center;">Nenhum usuário cadastrado.</td></tr>`
    }
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

// Carregar lista automaticamente ao carregar a página
document.addEventListener('DOMContentLoaded', carregarLista)
