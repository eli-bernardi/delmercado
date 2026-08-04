let resposta = document.getElementById('resposta')
let btn_cadastrar = document.getElementById('btn_cadastrar')
let btn_carga_lote = document.getElementById('btn_carga_lote')

// =========================================================================
// COMPORTAMENTO 1: CADASTRO MANUAL
// =========================================================================
btn_cadastrar.addEventListener('click', (e) => {
    e.preventDefault()

    let nome = document.getElementById('nome').value
    let sobrenome = document.getElementById('sobrenome').value
    let idade = document.getElementById('idade').value
    let email = document.getElementById('email').value
    let telefone = document.getElementById('telefone').value
    let endereco = document.getElementById('endereco').value
    let cidade = document.getElementById('cidade').value
    let estado = document.getElementById('estado').value

    if (!nome || !sobrenome || !idade || !email) {
        resposta.innerHTML = '<p style="color: #ffaa00;">Por favor, preencha todos os campos obrigatórios!</p>'
        return
    }

    let usuario = {
        nome: nome,
        sobrenome: sobrenome,
        idade: parseInt(idade) || 0,
        email: email,
        telefone: telefone,
        endereco: endereco,
        cidade: cidade,
        estado: estado
    }

    fetch('http://localhost:3000/usuario', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(usuario)
    })
        .then(res => res.json())
        .then(dados => {
            resposta.innerHTML = `<p style="color: lightgreen;">${dados.message || 'Usuário cadastrado com sucesso!'}</p>`
            document.querySelector('form').reset()
        })
        .catch((err) => {
            console.error('Erro ao cadastrar o usuário', err)
            resposta.innerHTML = '<p style="color: red;">Erro ao tentar cadastrar o usuário.</p>'
        })
})

// =========================================================================
// COMPORTAMENTO 2: CADASTRO EM LOTE (BULKCREATE VIA DUMMYJSON)
// =========================================================================
btn_carga_lote.addEventListener('click', (e) => {
    e.preventDefault()
    resposta.innerHTML = '<p style="color: yellow;">Buscando registros na API DummyJSON (https://dummyjson.com/users)...</p>'

    // 1. Consome os dados da API pública externa de usuários
    fetch('https://dummyjson.com/users')
        .then(res => res.json())
        .then(dadosExternos => {
            resposta.innerHTML = '<p style="color: cyan;">Dados recebidos com sucesso! Transmitindo lote para o back-end...</p>'

            // 2. Repassa o array (.users) diretamente ao endpoint de carga em lote
            return fetch('http://localhost:3000/usuarios/bulk', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dadosExternos.users)
            })
        })
        .then(res => res.json())
        .then(dados => {
            resposta.innerHTML = `<p style="color: lightgreen;">${dados.message || 'Carga em lote finalizada com sucesso!'}</p>`
        })
        .catch(err => {
            console.error('Erro na carga em lote:', err)
            resposta.innerHTML = '<p style="color: red;">Falha ao processar os dados da carga em lote no servidor local.</p>'
        })
})
