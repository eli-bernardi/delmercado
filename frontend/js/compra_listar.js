let resposta = document.getElementById('resposta')
let btn_listar = document.getElementById('btn_listar')
let resposta_tabela = document.getElementById('resposta_tabela')
let spinner = document.getElementById('table-spinner')

btn_listar.addEventListener('click', (e) => {
    e.preventDefault()
    carregarLista()
})

function carregarLista() {
    if (spinner) spinner.classList.remove('oculto')
    if (resposta_tabela) resposta_tabela.innerHTML = ''

    fetch('http://localhost:3000/compras')
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
        resposta.innerHTML = '<p style="color: red;">Erro ao tentar listar o histórico.</p>'
    })
}

function criarTbody(dados) {
    if (dados.length === 0) {
        return `<tr><td colspan="8" style="text-align: center;">Nenhuma movimentação registrada.</td></tr>`
    }

    let corpo = ''

    for (let i = 0; i < dados.length; i++) {
        let el = dados[i]
        let dataFormatada = new Date(el.dataCompra).toLocaleString('pt-BR')
        let tipoBadge = el.tipoMovimento === 'SAIDA'
            ? '<span style="color:#f87171;font-weight:700;">SAÍDA</span>'
            : '<span style="color:#4ade80;font-weight:700;">ENTRADA</span>'
        let statusBadge = el.statusCompra === 'PAGA'
            ? '<span style="color:#4ade80;font-weight:700;">PAGA</span>'
            : '<span style="color:#facc15;font-weight:700;">PENDENTE</span>'

        let userNome = el.usuarioCompra ? `${el.usuarioCompra.nome} ${el.usuarioCompra.sobrenome}` : 'Desconhecido'
        let prodNome = el.produtoCompra ? el.produtoCompra.nome : 'Desconhecido'

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
    }

    return corpo
}

// Carregar lista automaticamente ao carregar a página
document.addEventListener('DOMContentLoaded', carregarLista)
