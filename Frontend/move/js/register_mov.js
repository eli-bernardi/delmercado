let resposta = document.getElementById('resposta')
let btn_cadastrar = document.getElementById('btn_cadastrar')

btn_cadastrar.addEventListener('click', (e) => {
      e.preventDefault()

      const codUsuario = parseInt(document.getElementById('move-usuario').value)
      const codProduto = parseInt(document.getElementById('move-produto').value)
      const tipoMovimento = document.querySelector('input[name="tipoMovimento"]:checked').value
      const quantidadeMovimentada = parseInt(document.getElementById('move-quantidade').value)
      const formaPagamento = document.getElementById('move-pagamento').value
      const statusCompra = document.getElementById('move-status').value

      // Validação básica
      if (!codUsuario || !codProduto || !quantidadeMovimentada || quantidadeMovimentada < 1) {
            resposta.innerHTML = '<p>Preencha todos os campos corretamente!</p>'
            return
      }

      const movimento = {
            codUsuario: codUsuario,
            codProduto: codProduto,
            tipoMovimento: tipoMovimento,
            quantidadeMovimentada: quantidadeMovimentada,
            formaPagamento: formaPagamento,
            statusCompra: statusCompra
      }

      fetch('http://localhost:3000/compras', {
            method: 'POST',
            headers: {
                  'Content-Type': 'application/json'
            },
            body: JSON.stringify(movimento)
      })
            .then(res => res.json())
            .then(dados => {
                  resposta.innerHTML = ''

                  if (dados.message) {
                        resposta.innerHTML = `<p>${dados.message}</p>`
                  } else {
                        resposta.innerHTML = `<p>Movimentação registrada com sucesso!</p>`
                        document.querySelector('form').reset()
                        // Atualiza o preview
                        document.getElementById('preview-preco').textContent = '-'
                        document.getElementById('preview-desconto').textContent = '-'
                        document.getElementById('preview-final').textContent = '-'
                        document.getElementById('product-stock-hint').textContent = ''
                  }
            })
            .catch((err) => {
                  console.error('Erro ao registrar o movimento', err)
                  resposta.innerHTML = '<p>Erro ao tentar registrar a movimentação.</p>'
            })
})