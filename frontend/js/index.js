const API = 'http://localhost:3000'

const toast = document.getElementById('toast-message')
const busca = document.getElementById('search-input')
const spinner = document.getElementById('loading-spinner')
const grade = document.getElementById('products-grid')
const vazio = document.getElementById('empty-state')
const btnProdutos = document.getElementById('btn-load-products')
const btnUsuarios = document.getElementById('btn-load-users')

function mostrarToast(mensagem, erro = false) {
    if (!toast) return
    toast.textContent = mensagem
    toast.className = `toast ${erro ? 'erro' : 'sucesso'}`
    toast.style.display = 'block'
    clearTimeout(toast._timeout)
    toast._timeout = setTimeout(() => {
        toast.style.display = 'none'
    }, 4500)
}

let todosProdutos = []

async function carregarProdutos() {
    try {
        if (spinner) spinner.classList.remove('oculto')
        if (grade) grade.classList.add('oculto')
        if (vazio) vazio.classList.add('oculto')

        const resp = await fetch(`${API}/produtos`)
        if (!resp.ok) throw new Error('Erro ao buscar produtos')
        const dados = await resp.json()
        todosProdutos = dados

        if (spinner) spinner.classList.add('oculto')

        if (dados.length === 0) {
            if (vazio) vazio.classList.remove('oculto')
            return
        }

        renderizarProdutos(dados)
        if (grade) grade.classList.remove('oculto')
    } catch (erro) {
        if (spinner) spinner.classList.add('oculto')
        mostrarToast('Erro ao carregar produtos: ' + erro.message, true)
    }
}

function renderizarProdutos(produtos) {
    if (!grade) return
    grade.innerHTML = ''

    produtos.forEach(prod => {
        const nome = prod.nome || 'Sem nome'
        const preco = parseFloat(prod.preco || 0).toFixed(2)
        const desconto = parseFloat(prod.desconto || 0).toFixed(1)
        const estoque = parseInt(prod.qtdeEstoque || 0)
        const descricao = prod.descricao || 'Sem descrição'

        const card = document.createElement('div')
        card.className = 'cartao-base cartao-elevacao cartao-brilho flex flex-col'
        card.innerHTML = `
            <div class="flex justificar-entre itens-inicio mb-3">
                <h3 class="fonte-negrito texto-branco truncar" style="max-width: 150px;">${nome}</h3>
                <span class="texto-xs fundo-marca/20 texto-marca px-2 py-0.5 arredondado fonte-semi-negrito">ID ${prod.codProduto || '-'}</span>
            </div>
            <p class="texto-cinza-400 texto-xs mb-4 linha-clamp-2">${descricao}</p>
            <div class="mt-auto espaco-y-1" style="font-size: 0.875rem;">
                <div style="display: flex; justify-content: space-between;">
                    <span class="texto-cinza-400">Preço</span>
                    <span class="texto-branco fonte-semi-negrito">R$ ${preco}</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                    <span class="texto-cinza-400">Desconto</span>
                    <span class="texto-branco">${desconto}%</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                    <span class="texto-cinza-400">Estoque</span>
                    <span class="${estoque < 10 ? 'texto-vermelho-400' : 'texto-verde-400'} fonte-negrito">${estoque} unid.</span>
                </div>
            </div>
        `
        grade.appendChild(card)
    })
}

if (busca) {
    busca.addEventListener('input', (e) => {
        const termo = e.target.value.toLowerCase().trim()

        if (!termo) {
            renderizarProdutos(todosProdutos)
            if (grade) grade.classList.remove('oculto')
            if (vazio) vazio.classList.add('oculto')
            return
        }

        const filtrados = todosProdutos.filter(p => {
            const nome = (p.nome || '').toLowerCase()
            const descricao = (p.descricao || '').toLowerCase()
            const marca = (p.marca || '').toLowerCase()
            return nome.includes(termo) || descricao.includes(termo) || marca.includes(termo)
        })

        if (filtrados.length === 0) {
            if (vazio) vazio.classList.remove('oculto')
            if (grade) grade.classList.add('oculto')
        } else {
            if (vazio) vazio.classList.add('oculto')
            renderizarProdutos(filtrados)
            if (grade) grade.classList.remove('oculto')
        }
    })
}

async function importar(endpoint, apiExterna, chaveDados, botao, mensagemSucesso) {
    botao.disabled = true
    const textoOriginal = botao.textContent
    botao.textContent = 'Carregando...'

    try {
        // 1️⃣ Busca os dados da API externa (DummyJSON)
        const respostaExterna = await fetch(apiExterna)
        if (!respostaExterna.ok) throw new Error('Falha ao buscar dados da API externa')
        const dadosExternos = await respostaExterna.json()

        // A DummyJSON retorna { products: [...] } ou { users: [...] }
        const lista = dadosExternos[chaveDados] || dadosExternos

        if (!lista || lista.length === 0) {
            throw new Error('Nenhum dado retornado pela API externa')
        }

        // 2️⃣ Envia os dados para o backend no body do POST
        const resp = await fetch(`${API}/${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(lista)
        })

        const dados = await resp.json()
        if (!resp.ok) throw new Error(dados.message || dados.error || 'Falha na importação')

        mostrarToast(dados.message || mensagemSucesso)
        if (endpoint === 'produtos/bulk') await carregarProdutos()
    } catch (erro) {
        mostrarToast(erro.message, true)
    } finally {
        botao.disabled = false
        botao.textContent = textoOriginal
    }
}

if (btnProdutos) {
    btnProdutos.addEventListener('click', () => {
        importar(
            'produtos/bulk',
            'https://dummyjson.com/products?limit=100',
            'products',
            btnProdutos,
            'Produtos importados com sucesso!'
        )
    })
}

if (btnUsuarios) {
    btnUsuarios.addEventListener('click', () => {
        importar(
            'usuarios/bulk',
            'https://dummyjson.com/users?limit=100',
            'users',
            btnUsuarios,
            'Usuários importados com sucesso!'
        )
    })
}

document.addEventListener('DOMContentLoaded', () => {
    carregarProdutos()
})