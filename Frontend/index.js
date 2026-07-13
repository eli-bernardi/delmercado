// ============================================================
// CONFIGURAÇÕES
// ============================================================
const API = 'http://localhost:3000';

// ============================================================
// ELEMENTOS DO DOM
// ============================================================
const botaoMenu = document.getElementById('menu-toggle');
const menu = document.getElementById('menu');
const toast = document.getElementById('toast-message');
const busca = document.getElementById('search-input');
const spinner = document.getElementById('loading-spinner');
const grade = document.getElementById('products-grid');
const vazio = document.getElementById('empty-state');
const btnProdutos = document.getElementById('btn-load-products');
const btnUsuarios = document.getElementById('btn-load-users');

// ============================================================
// MENU MOBILE
// ============================================================
if (botaoMenu && menu) {
    botaoMenu.addEventListener('click', () => {
        menu.classList.toggle('aberto');
    });

    menu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth < 768) menu.classList.remove('aberto');
        });
    });
}

// ============================================================
// TOAST (notificação)
// ============================================================
function mostrarToast(mensagem, erro = false) {
    if (!toast) return;
    toast.textContent = mensagem;
    toast.className = `toast ${erro ? 'erro' : 'sucesso'}`;
    toast.classList.remove('oculto');
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => toast.classList.add('oculto'), 5000);
}

// ============================================================
// DASHBOARD – produtos
// ============================================================
let todosProdutos = [];

async function carregarProdutos() {
    try {
        spinner.classList.remove('oculto');
        grade.classList.add('oculto');
        vazio.classList.add('oculto');

        const resp = await fetch(`${API}/produtos`);
        if (!resp.ok) throw new Error('Erro ao buscar produtos');
        const dados = await resp.json();
        todosProdutos = dados;

        spinner.classList.add('oculto');

        if (dados.length === 0) {
            vazio.classList.remove('oculto');
            return;
        }

        renderizarProdutos(dados);
        grade.classList.remove('oculto');
    } catch (erro) {
        spinner.classList.add('oculto');
        mostrarToast('Erro ao carregar produtos: ' + erro.message, true);
    }
}

function renderizarProdutos(produtos) {
    grade.innerHTML = '';

    produtos.forEach(prod => {
        const preco = parseFloat(prod.preco || 0).toFixed(2);
        const desconto = parseFloat(prod.percentualDesconto || 0).toFixed(1);
        const estoque = parseInt(prod.quantidade || 0);

        const card = document.createElement('div');
        card.className = 'cartao-base cartao-elevacao cartao-brilho flex flex-col';
        card.innerHTML = `
      <div class="flex justificar-entre itens-inicio mb-3">
        <h3 class="fonte-negrito texto-branco truncar">${prod.nome || 'Sem nome'}</h3>
        <span class="texto-xs fundo-marca/20 texto-marca px-2 py-0.5 arredondado fonte-semi-negrito">ID ${prod.codProduto || '-'}</span>
      </div>
      <p class="texto-cinza-400 texto-xs mb-4 linha-clamp-2">${prod.descricao || 'Sem descrição'}</p>
      <div class="mt-auto espaco-y-1 texto-sm">
        <div class="flex justificar-entre">
          <span class="texto-cinza-400">Preço</span>
          <span class="texto-branco fonte-semi-negrito">R$ ${preco}</span>
        </div>
        <div class="flex justificar-entre">
          <span class="texto-cinza-400">Desconto</span>
          <span class="texto-branco">${desconto}%</span>
        </div>
        <div class="flex justificar-entre">
          <span class="texto-cinza-400">Estoque</span>
          <span class="${estoque < 10 ? 'texto-vermelho-400' : 'texto-verde-400'} fonte-negrito">${estoque} unid.</span>
        </div>
      </div>
    `;
        grade.appendChild(card);
    });
}

// ============================================================
// BUSCA DE PRODUTOS
// ============================================================
if (busca) {
    busca.addEventListener('input', (e) => {
        const termo = e.target.value.toLowerCase().trim();

        if (!termo) {
            renderizarProdutos(todosProdutos);
            grade.classList.remove('oculto');
            vazio.classList.add('oculto');
            return;
        }

        const filtrados = todosProdutos.filter(p =>
            (p.nome && p.nome.toLowerCase().includes(termo)) ||
            (p.descricao && p.descricao.toLowerCase().includes(termo)) ||
            (p.marca && p.marca.toLowerCase().includes(termo))
        );

        if (filtrados.length === 0) {
            vazio.classList.remove('oculto');
            grade.classList.add('oculto');
        } else {
            vazio.classList.add('oculto');
            renderizarProdutos(filtrados);
            grade.classList.remove('oculto');
        }
    });
}

// ============================================================
// IMPORTAÇÃO EM LOTE (bulk)
// ============================================================
async function importar(endpoint, botao, mensagemSucesso) {
    botao.disabled = true;
    const textoOriginal = botao.textContent;
    botao.textContent = 'Carregando...';

    try {
        const resp = await fetch(`${API}/${endpoint}`, { method: 'POST' });
        const dados = await resp.json();
        if (!resp.ok) throw new Error(dados.error || 'Falha na importação');
        mostrarToast(dados.message || mensagemSucesso);
        if (endpoint === 'produtos/bulk') await carregarProdutos();
    } catch (erro) {
        mostrarToast(erro.message, true);
    } finally {
        botao.disabled = false;
        botao.textContent = textoOriginal;
    }
}

if (btnProdutos) {
    btnProdutos.addEventListener('click', () => {
        importar('produtos/bulk', btnProdutos, 'Produtos importados com sucesso!');
    });
}

if (btnUsuarios) {
    btnUsuarios.addEventListener('click', () => {
        importar('usuarios/bulk', btnUsuarios, 'Usuários importados com sucesso!');
    });
}

// ============================================================
// ANIMAÇÃO REVELAR E CARREGAMENTO INICIAL
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    const elementos = document.querySelectorAll('.revelar');
    const observador = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('ativo');
                }
            });
        },
        { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );
    elementos.forEach(el => observador.observe(el));

    carregarProdutos();
});