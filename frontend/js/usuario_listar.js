let resposta = document.getElementById('resposta')
let btn_listar = document.getElementById('btn_listar')
let resposta_tabela = document.getElementById('resposta_tabela')
let spinner = document.getElementById('table-spinner')

btn_listar.addEventListener('click', (e) => {
    e.preventDefault()
    carregarLista()
})

function carregarLista() {
    if (spinner) spinner.classList.remove('oculto')
    if (resposta_tabela) resposta_tabela.innerHTML = ''

    fetch('http://localhost:3000/usuarios')
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
        resposta.innerHTML = '<p style="color: red;">Erro ao tentar listar os usuários.</p>'
    })
}

function criarTbody(dados) {
    if (dados.length === 0) {
        return `<tr><td colspan="9" style="text-align: center;">Nenhum usuário cadastrado.</td></tr>`
    }

    let corpo = ''

    for (let i = 0; i < dados.length; i++) {
        let el = dados[i]
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
    }

    return corpo
}

// Carregar lista automaticamente ao carregar a página
document.addEventListener('DOMContentLoaded', carregarLista)
