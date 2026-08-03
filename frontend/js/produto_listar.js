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

    fetch(`${API}/produtos`)
        .then(res => res.json())
        .then(dados => {
            if (spinner) spinner.classList.add('oculto')
            if (resposta_tabela) {
                resposta_tabela.innerHTML = criarTbody(dados)
            }
        })
        .catch((err) => {
            console.error('Erro ao listar os dados', err)
            if (spinner) spinner.classList.add('oculto')
            mostrarToast('Erro ao tentar listar os produtos.', true)
        })
}

function criarTbody(dados) {
    if (dados.length === 0) {
        return `<tr><td colspan="8" style="text-align: center;">Nenhum produto cadastrado.</td></tr>`
    }
    let corpo = ''
    dados.forEach(el => {
        corpo += `<tr>`
        corpo += `<td>${el.codProduto}</td>`
        corpo += `<td><img src="${el.imagem}" alt="${el.nome}" style="width:50px;height:50px;object-fit:cover;border-radius:8px;"></td>`
        corpo += `<td>${el.nome}</td>`
        corpo += `<td>${el.marca || '-'}</td>`
        corpo += `<td>${el.categoria}</td>`
        corpo += `<td>R$ ${parseFloat(el.preco || 0).toFixed(2)}</td>`
        corpo += `<td>${parseFloat(el.percentualDesconto || 0).toFixed(1)}%</td>`
        corpo += `<td><span class="${parseInt(el.quantidade || 0) < 10 ? 'texto-cor-vermelho-400' : 'texto-cor-verde-400'} peso-fonte-bold">${el.quantidade} un.</span></td>`
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
