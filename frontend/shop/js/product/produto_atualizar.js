let resposta = document.getElementById('resposta')
let btn_atualizar = document.getElementById('btn_atualizar')

btn_atualizar.addEventListener('click', (e) => {
      e.preventDefault()
      const codProduto = document.getElementById('codProduto').value
      if (!codProduto) {
            resposta.innerHTML = '<p>Informe o código do produto!</p>'
            return
      }
      const payload = {
            nome: document.getElementById('nome').value,
            descricao: document.getElementById('descricao').value,
            categoria: document.getElementById('categoria').value,
            preco: parseFloat(document.getElementById('preco').value) || 0,
            percentualDesconto: parseFloat(document.getElementById('percentualDesconto').value) || 0,
            quantidade: parseInt(document.getElementById('quantidade').value) || 0,
            marca: document.getElementById('marca').value,
            imagem: document.getElementById('imagem').value
      }

      fetch(`http://localhost:3000/produtos/${codProduto}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
      })
            .then(res => res.json())
            .then(dados => {
                  if (dados.message) {
                        resposta.innerHTML = `<p>${dados.message}</p>`
                        return
                  }
                  resposta.innerHTML = `
            <table>
                ${criarThead()}
                ${criarTbody([dados])}
            </table>
        `
                  document.querySelector('form').reset()
            })
            .catch((err) => {
                  console.error('Erro ao atualizar', err)
                  resposta.innerHTML = '<p>Erro ao atualizar o produto.</p>'
            })
})

function criarTbody(dados) {
      let corpo = '<tbody>'
      dados.forEach(el => {
            corpo += `<tr>
            <td>${el.codProduto}</td>
            <td><img src="${el.imagem}" alt="${el.nome}" style="width:50px;height:50px;object-fit:cover;border-radius:8px;"></td>
            <td>${el.nome} / ${el.marca}</td>
            <td>${el.categoria}</td>
            <td>R$ ${parseFloat(el.preco).toFixed(2)}</td>
            <td>${el.percentualDesconto}%</td>
            <td>${el.quantidade}</td>
        </tr>`
      })
      corpo += '</tbody>'
      return corpo
}

function criarThead() {
      return `<thead><tr>
        <th>ID</th>
        <th>Imagem</th>
        <th>Nome / Marca</th>
        <th>Categoria</th>
        <th>Preço (R$)</th>
        <th>Desconto (%)</th>
        <th>Estoque</th>
    </tr></thead>`
}