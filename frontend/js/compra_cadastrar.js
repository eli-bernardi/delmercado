let userSelect = document.getElementById('move-usuario')
let prodSelect = document.getElementById('move-produto')
let qtdInput = document.getElementById('move-quantidade')
let pagamentoSelect = document.getElementById('move-pagamento')
let statusSelect = document.getElementById('move-status')
let form = document.getElementById('movement-form')
let resposta = document.getElementById('resposta')

let previewPreco = document.getElementById('preview-preco')
let previewDesconto = document.getElementById('preview-desconto')
let previewFinal = document.getElementById('preview-final')
let stockHint = document.getElementById('product-stock-hint')

function carregarOpcoes() {
    if (!userSelect || !prodSelect) return

    userSelect.innerHTML = '<option value="">Carregando usuários...</option>'
    prodSelect.innerHTML = '<option value="">Carregando produtos...</option>'

    // Carrega Usuários
    fetch('http://localhost:3000/usuarios')
        .then(res => {
            if (!res.ok) throw new Error('Erro ao carregar usuários')
            return res.json()
        })
        .then(users => {
            userSelect.innerHTML = '<option value="">Selecione um usuário...</option>'
            for (let i = 0; i < users.length; i++) {
                let u = users[i]
                let opt = document.createElement('option')
                opt.value = u.codUsuario
                opt.textContent = `${u.nome} ${u.sobrenome} (ID: ${u.codUsuario})`
                userSelect.appendChild(opt)
            }
        })
        .catch(err => {
            console.error('Erro ao carregar usuários:', err)
            resposta.innerHTML = '<p style="color: red;">Não foi possível carregar as opções.</p>'
        })

    // Carrega Produtos
    fetch('http://localhost:3000/produtos')
        .then(res => {
            if (!res.ok) throw new Error('Erro ao carregar produtos')
            return res.json()
        })
        .then(prods => {
            prodSelect.innerHTML = '<option value="">Selecione um produto...</option>'
            for (let i = 0; i < prods.length; i++) {
                let p = prods[i]
                let opt = document.createElement('option')
                opt.value = p.codProduto
                opt.textContent = `${p.nome} (Qtd: ${p.qtdeEstoque}) - R$ ${parseFloat(p.preco).toFixed(2)}`
                opt.dataset.preco = p.preco
                opt.dataset.desconto = p.desconto
                opt.dataset.qtdeEstoque = p.qtdeEstoque
                prodSelect.appendChild(opt)
            }
        })
        .catch(err => {
            console.error('Erro ao carregar produtos:', err)
            resposta.innerHTML = '<p style="color: red;">Não foi possível carregar as opções.</p>'
        })
}

function atualizarPrevia() {
    let opt = prodSelect.options[prodSelect.selectedIndex]
    let qtd = parseInt(qtdInput.value) || 0

    if (!opt || !opt.value) {
        if (previewPreco) previewPreco.textContent = '-'
        if (previewDesconto) previewDesconto.textContent = '-'
        if (previewFinal) previewFinal.textContent = '-'
        if (stockHint) stockHint.textContent = ''
        return
    }

    let preco = parseFloat(opt.dataset.preco)
    let desconto = parseFloat(opt.dataset.desconto) || 0
    let estoque = parseInt(opt.dataset.qtdeEstoque)

    if (previewPreco) previewPreco.textContent = `R$ ${preco.toFixed(2)}`
    if (previewDesconto) previewDesconto.textContent = `${desconto.toFixed(1)}%`
    if (stockHint) stockHint.textContent = `Estoque disponível: ${estoque} un.`

    if (qtd > 0) {
        let precoComDesconto = preco * (1 - desconto / 100)
        let total = precoComDesconto * qtd
        if (previewFinal) previewFinal.textContent = `R$ ${total.toFixed(2)}`
    } else {
        if (previewFinal) previewFinal.textContent = '-'
    }
}

if (prodSelect) prodSelect.addEventListener('change', atualizarPrevia)
if (qtdInput) qtdInput.addEventListener('input', atualizarPrevia)

if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault()

        let idUsuario = parseInt(userSelect.value)
        let idProduto = parseInt(prodSelect.value)
        let tipoMovimento = document.querySelector('input[name="tipoMovimento"]:checked').value
        let quantidadeMovimentada = parseInt(qtdInput.value)
        let formaPagamento = pagamentoSelect.value
        let statusCompra = statusSelect.value
        let dataCompra = document.getElementById('move-data') ? document.getElementById('move-data').value : new Date().toISOString().split('T')[0]

        let opt = prodSelect.options[prodSelect.selectedIndex]
        let estoque = parseInt(opt.dataset.qtdeEstoque)

        if (tipoMovimento === 'SAIDA' && estoque < quantidadeMovimentada) {
            resposta.innerHTML = '<p style="color: #ffaa00;">Quantidade indisponível no estoque!</p>'
            return
        }

        let payload = {
            idUsuario: idUsuario,
            idProduto: idProduto,
            tipoMovimento: tipoMovimento,
            quantidadeMovimentada: quantidadeMovimentada,
            formaPagamento: formaPagamento,
            statusCompra: statusCompra,
            dataCompra: dataCompra
        }

        fetch('http://localhost:3000/compra', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
            .then(res => res.json())
            .then(data => {
                resposta.innerHTML = '<p style="color: lightgreen;">Transação registrada com sucesso!</p>'
                form.reset()
                atualizarPrevia()
                carregarOpcoes()
            })
            .catch(err => {
                console.error('Erro ao registrar compra:', err)
                resposta.innerHTML = `<p style="color: red;">${err.message || 'Erro ao registrar a compra.'}</p>`
            })
    })
}

document.addEventListener('DOMContentLoaded', () => {
    carregarOpcoes()
})
