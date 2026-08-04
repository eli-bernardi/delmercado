let resposta = document.getElementById('resposta')
let resposta_tabela = document.getElementById('resposta_tabela')
let spinner = document.getElementById('table-spinner')

function carregarRelatorio() {
    if (spinner) spinner.classList.remove('oculto')
    if (resposta_tabela) resposta_tabela.innerHTML = ''

    fetch('http://localhost:3000/compras/relatorios/volume-compras')
    .then(res => res.json())
    .then(dados => {
        if (spinner) spinner.classList.add('oculto')
        if (resposta_tabela) {
            resposta_tabela.innerHTML = criarTbody(dados)
        }
    })
    .catch((err) => {
        console.error('Erro ao buscar volume de compras', err)
        if (spinner) spinner.classList.add('oculto')
        resposta.innerHTML = '<p style="color: red;">Erro ao carregar os dados.</p>'
    })
}

function criarTbody(dados) {
    if (dados.length === 0) {
        return `<tr><td colspan="3" style="text-align: center;">Nenhuma compra registrada.</td></tr>`
    }

    let corpo = ''

    for (let i = 0; i < dados.length; i++) {
        let el = dados[i]
        corpo += `<tr>`
        corpo += `<td class="peso-fonte-semibold texto-cor-branco">${el.nome}</td>`
        corpo += `<td>${el.quantidade_total_movimentada} un.</td>`
        corpo += `<td style="color:#d62828; font-weight:900;">R$ ${parseFloat(el.valor_financeiro_movimentado).toFixed(2)}</td>`
        corpo += `</tr>`
    }

    return corpo
}

document.addEventListener('DOMContentLoaded', carregarRelatorio)
