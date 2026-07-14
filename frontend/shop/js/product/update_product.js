let resposta = document.getElementById('resposta')
let btn_atualizar = document.getElementById('btn_atualizar')

btn_atualizar.addEventListener('click', (e) => {
    e.preventDefault()

    const codProduto = document.getElementById('codProduto').value
    const nome = document.getElementById('nome').value
    const marca = document.getElementById('marca').value
    const descricao = document.getElementById('descricao').value
    const categoria = document.getElementById('categoria').value
    const preco = document.getElementById('preco').value
    const percentualDesconto = document.getElementById('percentualDesconto').value
    const quantidade = document.getElementById('quantidade').value
    const imagem = document.getElementById('imagem').value

    if (!codProduto) {
        resposta.innerHTML = '<p>Por favor, informe o Código do Produto!</p>'
        return
    }

    const produtoAtualizado = {
        nome: nome,
        marca: marca,
        descricao: descricao,
        categoria: categoria,
        preco: parseFloat(preco) || 0,
        percentualDesconto: parseFloat(percentualDesconto) || 0,
        quantidade: parseInt(quantidade) || 0,
        imagem: imagem
    }

    fetch(`http://localhost:3000/produtos/${codProduto}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(produtoAtualizado)
    })
        .then(res => res.json())
        .then(dados => {
            resposta.innerHTML = ''

            if (dados.message) {
                resposta.innerHTML = `<p>${dados.message}</p>`
                return
            }

            let dadosArr = [dados]

            resposta.innerHTML += `
            <table>
                ${criarThead()}
                ${criarTbody(dadosArr)}
            </table>
        `
            document.querySelector('form').reset()
        })
        .catch((err) => {
            console.error('Erro ao atualizar os dados', err)
            resposta.innerHTML = '<p>Erro ao tentar atualizar o produto.</p>'
        })
})

function criarTbody(dados) {
    let corpo = ''
    corpo += `<tbody>`
    dados.forEach(el => {
        corpo += `<tr>`
        corpo += `<td>${el.codProduto}</td>`
        corpo += `<td>${el.nome}</td>`
        corpo += `<td>${el.marca}</td>`
        corpo += `<td>${el.categoria}</td>`
        corpo += `<td>R$ ${parseFloat(el.preco).toFixed(2)}</td>`
        corpo += `<td>${el.percentualDesconto}%</td>`
        corpo += `<td>${el.quantidade}</td>`
        corpo += `</tr>`
    })
    corpo += `</tbody>`
    return corpo
}

function criarThead() {
    let cabecalho = ''
    cabecalho += `
        <thead>
            <tr>
                <th>Código</th>
                <th>Nome</th>
                <th>Marca</th>
                <th>Categoria</th>
                <th>Preço (R$)</th>
                <th>Desconto (%)</th>
                <th>Estoque</th>
            </tr>
        </thead>
    `
    return cabecalho
}