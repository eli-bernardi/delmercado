let resposta = document.getElementById('resposta')
let btn_listar = document.getElementById('btn_listar')

btn_listar.addEventListener('click', (e) => {
      e.preventDefault()
      fetch('http://localhost:3000/produtos')
            .then(res => res.json())
            .then(dados => {
                  resposta.innerHTML = `
            <table>
                ${criarThead()}
                ${criarTbody(dados)}
            </table>
        `
            })
            .catch((err) => {
                  console.error('Erro ao listar os dados', err)
                  resposta.innerHTML = '<p>Erro ao listar os produtos.</p>'
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