let resposta = document.getElementById('resposta')
let resposta_nome = document.getElementById('resposta_nome')
let btn_consultar = document.getElementById('btn_consultar')
let btn_consultar_nome = document.getElementById('btn_consultar_nome')

btn_consultar.addEventListener('click', (e) => {
    e.preventDefault()

    const codUsuario = document.getElementById('codUsuario').value

    if (!codUsuario) {
        resposta.innerHTML = '<p>Por favor, informe o Código do Usuário!</p>'
        return
    }

    fetch(`http://localhost:3000/usuario/${codUsuario}`)
        .then(res => res.json())
        .then(dados => {
            if (!dados) {
                resposta.innerHTML = `<p>${'Usuário não encontrado!'}</p>`
                return
            }

            let dadosArr = [dados]

            resposta.innerHTML = ''
            if (resposta_nome) resposta_nome.innerHTML = ''
            resposta.innerHTML += `
            <table>
                ${criarThead()}
                ${criarTbody(dadosArr)}
            </table>
        `
        })
        .catch((err) => {
            console.error('Erro ao consultar os dados', err)
            resposta.innerHTML = '<p>Erro ao consultar o usuário.</p>'
        })
})

btn_consultar_nome.addEventListener('click', (e) => {
    e.preventDefault()

    const nome = document.getElementById('nome').value

    if (!nome) {
        if (resposta_nome) resposta_nome.innerHTML = '<p>Por favor, informe o Nome do Usuário!</p>'
        return
    }

    fetch(`http://localhost:3000/usuario/buscar/${nome}`)
        .then(res => res.json())
        .then(dados => {
            if (!dados) {
                if (resposta_nome) resposta_nome.innerHTML = `<p>${'Usuário não encontrado!'}</p>`
                return
            }

            let dadosArr = [dados]

            resposta.innerHTML = ''
            if (resposta_nome) resposta_nome.innerHTML = ''
            if (resposta_nome) resposta_nome.innerHTML += `
            <table>
                ${criarThead()}
                ${criarTbody(dadosArr)}
            </table>
        `
        })
        .catch((err) => {
            console.error('Erro ao consultar os dados', err)
            if (resposta_nome) resposta_nome.innerHTML = '<p>Erro ao consultar o usuário.</p>'
        })
})

function criarTbody(dados) {
    let corpo = ''
    corpo += `<tbody>`
    dados.forEach(el => {
        corpo += `<tr>`
        corpo += `<td>${el.codUsuario}</td>`
        corpo += `<td>${el.nome}</td>`
        corpo += `<td>${el.sobrenome}</td>`
        corpo += `<td>${el.idade}</td>`
        corpo += `<td>${el.email}</td>`
        corpo += `<td>${el.telefone}</td>`
        corpo += `<td>${el.endereco}</td>`
        corpo += `<td>${el.cidade}</td>`
        corpo += `<td>${el.estado}</td>`
        corpo += `</tr>`
    })
    corpo += `</tbody>`
    return corpo
}

function criarThead() {
    let cabecalho = ''
    cabecalho += `
        <thead>
            <tr>
                <th>Código</th>
                <th>Nome</th>
                <th>Sobrenome</th>
                <th>Idade</th>
                <th>Email</th>
                <th>Telefone</th>
                <th>Endereço</th>
                <th>Cidade</th>
                <th>Estado</th>
            </tr>
        </thead>
    `
    return cabecalho
}