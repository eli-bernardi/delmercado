let resposta = document.getElementById('resposta')
let btn_carregar = document.getElementById('btn_carregar')
let btn_atualizar = document.getElementById('btn_atualizar')

btn_carregar.addEventListener('click', (e) => {
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
        .then(user => {
            document.getElementById('nome').value = user.nome || ''
            document.getElementById('sobrenome').value = user.sobrenome || ''
            document.getElementById('idade').value = user.idade || ''
            document.getElementById('email').value = user.email || ''
            document.getElementById('telefone').value = user.telefone || ''
            document.getElementById('endereco').value = user.endereco || ''
            document.getElementById('cidade').value = user.cidade || ''
            document.getElementById('estado').value = user.estado || ''
            resposta.innerHTML = '<p style="color: lightgreen;">Usuário carregado com sucesso!</p>'
        })
        .catch((err) => {
            console.error('Erro ao buscar o usuário', err)
            resposta.innerHTML = '<p style="color: red;">Usuário não encontrado no banco de dados.</p>'
        })
})

btn_atualizar.addEventListener('click', (e) => {
    e.preventDefault()

    let codUsuario = document.getElementById('codUsuario').value
    let nome = document.getElementById('nome').value
    let sobrenome = document.getElementById('sobrenome').value
    let idade = document.getElementById('idade').value
    let email = document.getElementById('email').value
    let telefone = document.getElementById('telefone').value
    let endereco = document.getElementById('endereco').value
    let cidade = document.getElementById('cidade').value
    let estado = document.getElementById('estado').value

    if (!codUsuario) {
        resposta.innerHTML = '<p style="color: #ffaa00;">Por favor, informe o Código do Usuário!</p>'
        return
    }

    let usuarioAtualizado = {
        nome: nome,
        sobrenome: sobrenome,
        idade: parseInt(idade) || 0,
        email: email,
        telefone: telefone,
        endereco: endereco,
        cidade: cidade,
        estado: estado
    }

    fetch(`http://localhost:3000/usuario/${codUsuario}`, {
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
            resposta.innerHTML = `<p style="color: lightgreen;">${dados.message || 'Usuário atualizado com sucesso!'}</p>`
            document.getElementById('user-form').reset()
            document.getElementById('codUsuario').value = ''
        })
        .catch((err) => {
            console.error('Erro ao atualizar os dados', err)
            resposta.innerHTML = '<p style="color: red;">Erro ao tentar atualizar o usuário.</p>'
        })
})
