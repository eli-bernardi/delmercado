let resposta = document.getElementById('resposta')
let btn_bulk = document.getElementById('btn_bulk')

if (btn_bulk) {
    btn_bulk.addEventListener('click', (e) => {
        e.preventDefault()
        
        btn_bulk.disabled = true
        btn_bulk.textContent = 'Carregando...'

        fetch('http://localhost:3000/usuarios/bulk', {
            method: 'POST'
        })
        .then(res => res.json())
        .then(dados => {
            console.log(dados.message)
            resposta.innerHTML = ''
            resposta.innerHTML += `<p>${dados.message}</p>`
            btn_bulk.disabled = false
            btn_bulk.textContent = 'Carregar Usuários'
        })
        .catch((err) => {
            console.error('Erro ao carregar usuários em lote', err)
            resposta.innerHTML = '<p>Erro ao tentar carregar usuários em lote.</p>'
            btn_bulk.disabled = false
            btn_bulk.textContent = 'Carregar Usuários'
        })
    })
}