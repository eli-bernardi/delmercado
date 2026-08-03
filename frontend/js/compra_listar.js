const API = 'http://localhost:3000'
const resposta = document.getElementById('resposta')
const btn_listar = document.getElementById('btn_listar')
const resposta_tabela = document.getElementById('resposta_tabela')
const spinner = document.getElementById('table-spinner')

btn_listar.addEventListener('click', (e) => {
    e.preventDefault()
    carregarLista()
})

async function carregarLista() {
    if (spinner) spinner.classList.remove('oculto')
    if (resposta_tabela) resposta_tabela.innerHTML = ''

    fetch(`${API}/compras`)
        .then(res => res.json())
        .then(dados => {
            if (spinner) spinner.classList.add('oculto')
            if (resposta_tabela) {
                resposta_tabela.innerHTML = criarTbody(dados)
            }
        })
        .catch((err) => {
            console.error('Erro ao listar as compras', err)
            if (spinner) spinner.classList.add('oculto')
            mostrarToast('Erro ao tentar listar o histórico.', true)
        })
}

function criarTbody(dados) {
    if (dados.length === 0) {
        return `<tr><td colspan="8" style="text-align: center;">Nenhuma movimentação registrada.</td></tr>`
    }
    let corpo = ''
    dados.forEach(el => {
        const dataFormatada = new Date(el.dataCompra).toLocaleString('pt-BR')
        const tipoBadge = el.tipoMovimento === 'SAIDA'
            ? '<span style="color:#f87171;font-weight:700;">SAÍDA</span>'
            : '<span style="color:#4ade80;font-weight:700;">ENTRADA</span>'
        const statusBadge = el.statusCompra === 'PAGA'
            ? '<span style="color:#4ade80;font-weight:700;">PAGA</span>'
            : '<span style="color:#facc15;font-weight:700;">PENDENTE</span>'

        const userNome = el.usuario ? `${el.usuario.nome} ${el.usuario.sobrenome}` : 'Desconhecido'
        const prodNome = el.produto ? el.produto.nome : 'Desconhecido'

        corpo += `<tr>`
        corpo += `<td>${dataFormatada}</td>`
        corpo += `<td>${tipoBadge}</td>`
        corpo += `<td>${userNome}</td>`
        corpo += `<td>${prodNome}</td>`
        corpo += `<td>${el.quantidadeMovimentada}</td>`
        corpo += `<td>R$ ${parseFloat(el.precoFinal || 0).toFixed(2)}</td>`
        corpo += `<td>${el.formaPagamento || '-'}</td>`
        corpo += `<td>${statusBadge}</td>`
        corpo += `</tr>`
    })
    return corpo
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

// Carregar lista automaticamente ao carregar a página
document.addEventListener('DOMContentLoaded', carregarLista)
