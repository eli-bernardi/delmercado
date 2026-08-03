const API = 'http://localhost:3000'
const resposta = document.getElementById('resposta')
const resposta_tabela = document.getElementById('resposta_tabela')
const spinner = document.getElementById('table-spinner')

async function carregarRelatorio() {
    if (spinner) spinner.classList.remove('oculto')
    if (resposta_tabela) resposta_tabela.innerHTML = ''

    fetch(`${API}/compras/relatorios/produtos-criticos`)
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
            mostrarToast('Erro ao carregar os dados.', true)
        })
}

function criarTbody(dados) {
    if (dados.length === 0) {
        return `<tr><td colspan="4" style="text-align: center; color: #4ade80;">Nenhum produto crítico em estoque.</td></tr>`
    }
    let corpo = ''
    dados.forEach(el => {
        corpo += `<tr>`
        corpo += `<td>${el.codigo_produto}</td>`
        corpo += `<td class="peso-fonte-semibold texto-cor-branco">${el.nome}</td>`
        corpo += `<td>${el.categoria || '-'}</td>`
        corpo += `<td style="color:#facc15; font-weight:700;">${el.quantidade_atual} un.</td>`
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

document.addEventListener('DOMContentLoaded', carregarRelatorio)
