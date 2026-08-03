const API = 'http://localhost:3000'
const resposta = document.getElementById('resposta')
const btn_consultar = document.getElementById('btn_consultar')
const btn_consultar_nome = document.getElementById('btn_consultar_nome')
const resposta_tabela = document.getElementById('resposta_tabela')

btn_consultar.addEventListener('click', (e) => {
    e.preventDefault()

    const codProduto = document.getElementById('codProduto').value

    if (!codProduto) {
        mostrarToast('Por favor, informe o Código do Produto!', true)
        return
    }

    fetch(`${API}/produto/${codProduto}`)
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
            mostrarToast('Produto não encontrado.', true)
        })
})

btn_consultar_nome.addEventListener('click', (e) => {
    e.preventDefault()

    const nome = document.getElementById('nome').value

    if (!nome) {
        mostrarToast('Por favor, informe o Nome do Produto!', true)
        return
    }

    fetch(`${API}/produto/buscar/${nome}`)
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
            mostrarToast('Produto não encontrado.', true)
        })
})

function criarTbody(dados) {
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
