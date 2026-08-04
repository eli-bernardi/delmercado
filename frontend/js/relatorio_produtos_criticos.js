let resposta = document.getElementById('resposta')
let resposta_tabela = document.getElementById('resposta_tabela')
let spinner = document.getElementById('table-spinner')

function carregarRelatorio() {
    if (spinner) spinner.classList.remove('oculto')
    if (resposta_tabela) resposta_tabela.innerHTML = ''

    fetch('http://localhost:3000/compras/relatorios/produtos-criticos')
        .then(res => res.json())
        .then(dados => {
            if (spinner) spinner.classList.add('oculto')
            if (resposta_tabela) {
                resposta_tabela.innerHTML = criarTbody(dados)
            }
        })
        .catch((err) => {
            console.error('Erro ao buscar produtos críticos', err)
            if (spinner) spinner.classList.add('oculto')
            resposta.innerHTML = '<p style="color: red;">Erro ao carregar os dados.</p>'
        })
}

function criarTbody(dados) {
    if (dados.length === 0) {
        return `<tr><td colspan="4" style="text-align: center; color: #4ade80;">Nenhum produto crítico em estoque.</td></tr>`
    }

    let corpo = ''

    for (let i = 0; i < dados.length; i++) {
        let el = dados[i]
        corpo += `<tr>`
        corpo += `<td>${el.codigo_produto}</td>`
        corpo += `<td class="peso-fonte-semibold texto-cor-branco">${el.nome}</td>`
        corpo += `<td>${el.categoria || '-'}</td>`
        corpo += `<td style="color:#facc15; font-weight:700;">${el.quantidade_atual} un.</td>`
        corpo += `</tr>`
    }

    return corpo
}

document.addEventListener('DOMContentLoaded', carregarRelatorio)
