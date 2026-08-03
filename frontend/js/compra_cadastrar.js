const API = 'http://localhost:3000'

const userSelect = document.getElementById('move-usuario')
const prodSelect = document.getElementById('move-produto')
const qtdInput = document.getElementById('move-quantidade')
const pagamentoSelect = document.getElementById('move-pagamento')
const statusSelect = document.getElementById('move-status')
const form = document.getElementById('movement-form')
const resposta = document.getElementById('resposta')

const previewPreco = document.getElementById('preview-preco')
const previewDesconto = document.getElementById('preview-desconto')
const previewFinal = document.getElementById('preview-final')
const stockHint = document.getElementById('product-stock-hint')

async function carregarOpcoes() {
    try {
        if (!userSelect || !prodSelect) return

        userSelect.innerHTML = '<option value="">Carregando usuários...</option>'
        prodSelect.innerHTML = '<option value="">Carregando produtos...</option>'

        // Carrega Usuários
        const resUsers = await fetch(`${API}/usuarios`)
        if (!resUsers.ok) throw new Error('Erro ao carregar usuários')
        const users = await resUsers.json()
        userSelect.innerHTML = '<option value="">Selecione um usuário...</option>'
        users.forEach(u => {
            const opt = document.createElement('option')
            opt.value = u.codUsuario
            opt.textContent = `${u.nome} ${u.sobrenome} (ID: ${u.codUsuario})`
            userSelect.appendChild(opt)
        })

        // Carrega Produtos
        const resProds = await fetch(`${API}/produtos`)
        if (!resProds.ok) throw new Error('Erro ao carregar produtos')
        const prods = await resProds.json()
        prodSelect.innerHTML = '<option value="">Selecione um produto...</option>'
        prods.forEach(p => {
            const opt = document.createElement('option')
            opt.value = p.codProduto
            opt.textContent = `${p.nome} (Qtd: ${p.quantidade}) - R$ ${parseFloat(p.preco).toFixed(2)}`
            opt.dataset.preco = p.preco
            opt.dataset.desconto = p.percentualDesconto
            opt.dataset.quantidade = p.quantidade
            prodSelect.appendChild(opt)
        })
    } catch (err) {
        console.error('Erro ao popular selects:', err)
        mostrarToast('Não foi possível carregar as opções.', true)
    }
}

function atualizarPrevia() {
    const opt = prodSelect.options[prodSelect.selectedIndex]
    const qtd = parseInt(qtdInput.value) || 0

    if (!opt || !opt.value) {
        if (previewPreco) previewPreco.textContent = '-'
        if (previewDesconto) previewDesconto.textContent = '-'
        if (previewFinal) previewFinal.textContent = '-'
        if (stockHint) stockHint.textContent = ''
        return
    }

    const preco = parseFloat(opt.dataset.preco)
    const desconto = parseFloat(opt.dataset.desconto) || 0
    const estoque = parseInt(opt.dataset.quantidade)

    if (previewPreco) previewPreco.textContent = `R$ ${preco.toFixed(2)}`
    if (previewDesconto) previewDesconto.textContent = `${desconto.toFixed(1)}%`
    if (stockHint) stockHint.textContent = `Estoque disponível: ${estoque} un.`

    if (qtd > 0) {
        const precoComDesconto = preco * (1 - desconto / 100)
        const total = precoComDesconto * qtd
        if (previewFinal) previewFinal.textContent = `R$ ${total.toFixed(2)}`
    } else {
        if (previewFinal) previewFinal.textContent = '-'
    }
}

if (prodSelect) prodSelect.addEventListener('change', atualizarPrevia)
if (qtdInput) qtdInput.addEventListener('input', atualizarPrevia)

if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault()

        const codUsuario = parseInt(userSelect.value)
        const codProduto = parseInt(prodSelect.value)
        const tipoMovimento = document.querySelector('input[name="tipoMovimento"]:checked').value
        const quantidadeMovimentada = parseInt(qtdInput.value)
        const formaPagamento = pagamentoSelect.value
        const statusCompra = statusSelect.value

        const opt = prodSelect.options[prodSelect.selectedIndex]
        const estoque = parseInt(opt.dataset.quantidade)

        if (tipoMovimento === 'SAIDA' && estoque < quantidadeMovimentada) {
            mostrarToast('Quantidade indisponível no estoque!', true)
            return
        }

        const payload = {
            codUsuario,
            codProduto,
            tipoMovimento,
            quantidadeMovimentada,
            formaPagamento,
            statusCompra
        }

        try {
            const res = await fetch(`${API}/compra`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })

            const data = await res.json()
            if (!res.ok) throw new Error(data.message || 'Erro ao registrar compra.')

            mostrarToast('Transação registrada com sucesso!', false)
            form.reset()
            atualizarPrevia()
            await carregarOpcoes()
        } catch (err) {
            mostrarToast(err.message, true)
        }
    })
}

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

document.addEventListener('DOMContentLoaded', () => {
    carregarOpcoes()
})
