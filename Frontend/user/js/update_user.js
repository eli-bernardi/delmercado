let resposta = document.getElementById('resposta')
let btn_atualizar = document.getElementById('btn_atualizar')

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
        resposta.innerHTML = '<p>Por favor, informe o Código do Usuário!</p>'
        return
    }

    const usuarioAtualizado = {
        nome: nome,
        sobrenome: sobrenome,
        idade: parseInt(idade),
        email: email,
        telefone: telefone,
        endereco: endereco,
        cidade: cidade,
        estado: estado
    }

    fetch(`http://localhost:3000/usuarios/${codUsuario}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(usuarioAtualizado)
    })
    .then(res => {
        if (!res.ok) {
            return res.json().then(err => { throw new Error(err.message || 'Erro ao atualizar') })
        }
        return res.json()
    })
    .then(dados => {
        resposta.innerHTML = ''
        // Se retornar o usuário atualizado
        let dadosArr = [dados]
        resposta.innerHTML += `
            <table>
                ${criarThead()}
                ${criarTbody(dadosArr)}
            </table>
        `
        document.querySelector('form').reset()
        resposta.innerHTML += '<p style="color: #4ade80; margin-top: 10px;">✅ Usuário atualizado com sucesso!</p>'
    })
    .catch((err) => {
        console.error('Erro ao atualizar os dados', err)
        resposta.innerHTML = `<p>${err.message || 'Erro ao tentar atualizar o usuário.'}</p>`
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