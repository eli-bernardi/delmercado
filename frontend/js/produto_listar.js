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

    fetch('http://localhost:3000/produtos')
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
        resposta.innerHTML = '<p style="color: red;">Erro ao tentar listar os produtos.</p>'
    })
}

function criarTbody(dados) {
    if (dados.length === 0) {
        return `<tr><td colspan="8" style="text-align: center;">Nenhum produto cadastrado.</td></tr>`
    }

    let corpo = ''

    for (let i = 0; i < dados.length; i++) {
        let el = dados[i]
        corpo += `<tr>`
        corpo += `<td>${el.codProduto}</td>`
        corpo += `<td><img src="${el.imagem}" alt="${el.nome}" style="width:50px;height:50px;object-fit:cover;border-radius:8px;"></td>`
        corpo += `<td>${el.nome}</td>`
        corpo += `<td>${el.marca || '-'}</td>`
        corpo += `<td>${el.categoria}</td>`
        corpo += `<td>R$ ${parseFloat(el.preco || 0).toFixed(2)}</td>`
        corpo += `<td>${parseFloat(el.desconto || 0).toFixed(1)}%</td>`
        corpo += `<td><span class="${parseInt(el.qtdeEstoque || 0) < 10 ? 'texto-cor-vermelho-400' : 'texto-cor-verde-400'} peso-fonte-bold">${el.qtdeEstoque} un.</span></td>`
        corpo += `</tr>`
    }

    return corpo
}

// Carregar lista automaticamente ao carregar a página
document.addEventListener('DOMContentLoaded', carregarLista)
