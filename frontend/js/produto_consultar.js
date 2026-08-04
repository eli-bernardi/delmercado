let resposta = document.getElementById('resposta')
let btn_consultar = document.getElementById('btn_consultar')
let btn_consultar_nome = document.getElementById('btn_consultar_nome')
let resposta_tabela = document.getElementById('resposta_tabela')

btn_consultar.addEventListener('click', (e) => {
    e.preventDefault()

    let codProduto = document.getElementById('codProduto').value

    if (!codProduto) {
        resposta.innerHTML = '<p style="color: #ffaa00;">Por favor, informe o Código do Produto!</p>'
        return
    }

    fetch(`http://localhost:3000/produto/${codProduto}`)
        .then(res => {
            if (!res.ok) {
                throw new Error('Produto não encontrado!')
            }
            return res.json()
        })
        .then(dados => {
            resposta_tabela.innerHTML = criarTbody([dados])
        })
        .catch((err) => {
            console.error('Erro ao consultar os dados', err)
            resposta_tabela.innerHTML = `<tr><td colspan="8" style="text-align: center; color: #f87171;">Produto não encontrado.</td></tr>`
            resposta.innerHTML = '<p style="color: #f87171;">Produto não encontrado.</p>'
        })
})

btn_consultar_nome.addEventListener('click', (e) => {
    e.preventDefault()

    let nome = document.getElementById('nome').value

    if (!nome) {
        resposta.innerHTML = '<p style="color: #ffaa00;">Por favor, informe o Nome do Produto!</p>'
        return
    }

    fetch(`http://localhost:3000/produto/buscar/${nome}`)
        .then(res => {
            if (!res.ok) {
                throw new Error('Produto não encontrado!')
            }
            return res.json()
        })
        .then(dados => {
            resposta_tabela.innerHTML = criarTbody([dados])
        })
        .catch((err) => {
            console.error('Erro ao consultar os dados', err)
            resposta_tabela.innerHTML = `<tr><td colspan="8" style="text-align: center; color: #f87171;">Produto não encontrado.</td></tr>`
            resposta.innerHTML = '<p style="color: red;">Produto não encontrado.</p>'
        })
})

function criarTbody(dados) {
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
