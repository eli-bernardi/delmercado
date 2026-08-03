const API = 'http://localhost:3000'
const resposta = document.getElementById('resposta')
const btn_cadastrar = document.getElementById('btn_cadastrar')

btn_cadastrar.addEventListener('click', (e) => {
    e.preventDefault()

    const nome = document.getElementById('nome').value
    const sobrenome = document.getElementById('sobrenome').value
    const idade = document.getElementById('idade').value
    const email = document.getElementById('email').value
    const telefone = document.getElementById('telefone').value
    const endereco = document.getElementById('endereco').value
    const cidade = document.getElementById('cidade').value
    const estado = document.getElementById('estado').value

    if(!nome || !sobrenome || !idade || !email || !telefone || !endereco || !cidade || !estado) {
        mostrarToast('Por favor, preencha todos os campos obrigatórios!', true)
        return
    }

    const usuario = {
        nome: nome,
        sobrenome: sobrenome,
        idade: parseInt(idade) || 0,
        email: email,
        telefone: telefone,
        endereco: endereco,
        cidade: cidade,
        estado: estado
    }

    fetch(`${API}/usuario`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(usuario)
    })
        .then(res => res.json())
        .then(dados => {
            mostrarToast(dados.message || 'Usuário cadastrado com sucesso!', false)
            document.querySelector('form').reset()
        })
        .catch((err) => {
            console.error('Erro ao cadastrar o usuário', err)
            mostrarToast('Erro ao tentar cadastrar o usuário.', true)
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
