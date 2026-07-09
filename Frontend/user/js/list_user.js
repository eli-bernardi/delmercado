let resposta = document.getElementById('resposta')
let btn_listar = document.getElementById('btn_listar')

btn_listar.addEventListener('click', (e) => {
      e.preventDefault()

      fetch('http://localhost:3000/usuarios')
            .then(res => res.json())
            .then(dados => {
                  resposta.innerHTML = ''
                  if (dados.length === 0) {
                        resposta.innerHTML = '<p>Nenhum usuário cadastrado.</p>'
                        return
                  }
                  resposta.innerHTML += `
            <table>
                ${criarThead()}
                ${criarTbody(dados)}
            </table>
        `
            })
            .catch((err) => {
                  console.error('Erro ao listar os dados', err)
                  resposta.innerHTML = '<p>Erro ao tentar listar os usuários.</p>'
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