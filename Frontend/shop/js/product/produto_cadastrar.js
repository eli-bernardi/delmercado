let resposta = document.getElementById('resposta')
let btn_cadastrar = document.getElementById('btn_cadastrar')

btn_cadastrar.addEventListener('click', (e) => {
      e.preventDefault()

      const produto = {
            nome: document.getElementById('nome').value,
            descricao: document.getElementById('descricao').value,
            categoria: document.getElementById('categoria').value,
            preco: parseFloat(document.getElementById('preco').value) || 0,
            percentualDesconto: parseFloat(document.getElementById('percentualDesconto').value) || 0,
            quantidade: parseInt(document.getElementById('quantidade').value) || 0,
            marca: document.getElementById('marca').value,
            imagem: document.getElementById('imagem').value
      }

      fetch('http://localhost:3000/produtos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(produto)
      })
            .then(res => res.json())
            .then(dados => {
                  resposta.innerHTML = `<p>${dados.message}</p>`
                  document.querySelector('form').reset()
            })
            .catch((err) => {
                  console.error('Erro ao cadastrar o produto', err)
                  resposta.innerHTML = '<p>Erro ao tentar cadastrar o produto.</p>'
            })
})