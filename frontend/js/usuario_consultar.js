let resposta = document.getElementById('resposta')
let btn_consultar = document.getElementById('btn_consultar')
let btn_consultar_nome = document.getElementById('btn_consultar_nome')
let resposta_tabela = document.getElementById('resposta_tabela')

btn_consultar.addEventListener('click', (e) => {
    e.preventDefault()

    let codUsuario = document.getElementById('codUsuario').value

    if (!codUsuario) {
        resposta.innerHTML = '<p style="color: #ffaa00;">Por favor, informe o Código do Usuário!</p>'
        return
    }

    fetch(`http://localhost:3000/usuario/${codUsuario}`)
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
            resposta.innerHTML = '<p style="color: red;">Usuário não encontrado.</p>'
        })
})

btn_consultar_nome.addEventListener('click', (e) => {
    e.preventDefault()

    let nome = document.getElementById('nome').value

    if (!nome) {
        resposta.innerHTML = '<p style="color: #ffaa00;">Por favor, informe o Nome do Usuário!</p>'
        return
    }

    fetch(`http://localhost:3000/usuario/buscar/${nome}`)
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
            resposta.innerHTML = '<p style="color: red;">Usuário não encontrado.</p>'
        })
})

function criarTbody(dados) {
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
