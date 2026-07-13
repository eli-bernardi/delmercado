let resposta = document.getElementById('resposta')
let btn_listar = document.getElementById('btn_listar')

btn_listar.addEventListener('click', (e) => {
      e.preventDefault()

      fetch('http://localhost:3000/compras')
            .then(res => res.json())
            .then(dados => {
                  resposta.innerHTML = ''

                  if (dados.length === 0) {
                        resposta.innerHTML = '<p>Nenhuma movimentação registrada.</p>'
                        return
                  }

                  resposta.innerHTML = `
            <table>
                ${criarThead()}
                ${criarTbody(dados)}
            </table>
        `
            })
            .catch((err) => {
                  console.error('Erro ao listar as movimentações', err)
                  resposta.innerHTML = '<p>Erro ao listar as movimentações.</p>'
            })
})

function criarTbody(dados) {
      let corpo = '<tbody>'
      dados.forEach(el => {
            const dataFormatada = new Date(el.dataCompra).toLocaleString('pt-BR')
            const tipoBadge = el.tipoMovimento === 'SAIDA'
                  ? '<span style="color:#f87171;font-weight:700;">SAÍDA</span>'
                  : '<span style="color:#4ade80;font-weight:700;">ENTRADA</span>'
            const statusBadge = el.status === 'PAGA'
                  ? '<span style="color:#4ade80;">PAGA</span>'
                  : '<span style="color:#facc15;">PENDENTE</span>'

            corpo += `<tr>
            <td>${dataFormatada}</td>
            <td>${tipoBadge}</td>
            <td>${el.usuario ? el.usuario.nome + ' ' + el.usuario.sobrenome : 'Desconhecido'}</td>
            <td>${el.produto ? el.produto.nome : 'Desconhecido'}</td>
            <td>${el.quantidadeMovimentada}</td>
            <td>R$ ${parseFloat(el.precoFinal || 0).toFixed(2)}</td>
            <td>${el.formaPagamento || '-'}</td>
            <td>${statusBadge}</td>
        </tr>`
      })
      corpo += '</tbody>'
      return corpo
}

function criarThead() {
      return `<thead>
        <tr>
            <th>Data</th>
            <th>Movimento</th>
            <th>Usuário</th>
            <th>Produto</th>
            <th>Qtd</th>
            <th>Preço Final</th>
            <th>Pagamento</th>
            <th>Status</th>
        </tr>
    </thead>`
}