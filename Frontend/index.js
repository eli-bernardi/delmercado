// ============================================================
// CONFIGURAÇÕES
// ============================================================
const API_BASE = 'http://localhost:3000';

// ============================================================
// DOM ELEMENTS
// ============================================================
const menuToggle = document.getElementById('menu-toggle');
const menu = document.getElementById('menu');
const toast = document.getElementById('toast-message');
const searchInput = document.getElementById('search-input');
const loadingSpinner = document.getElementById('loading-spinner');
const productsGrid = document.getElementById('products-grid');
const emptyState = document.getElementById('empty-state');
const btnLoadProducts = document.getElementById('btn-load-products');
const btnLoadUsers = document.getElementById('btn-load-users');

// ============================================================
// MENU MOBILE
// ============================================================
if (menuToggle && menu) {
    menuToggle.addEventListener('click', () => {
        menu.classList.toggle('open');
    });

    menu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth < 768) {
                menu.classList.remove('open');
            }
        });
    });
}

// ============================================================
// TOAST
// ============================================================
function showToast(message, isError = false) {
    if (!toast) return;
    toast.textContent = message;
    toast.className = `toast ${isError ? 'error' : 'success'}`;
    toast.classList.remove('hidden');
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => toast.classList.add('hidden'), 5000);
}

// ============================================================
// DASHBOARD
// ============================================================
let allProducts = [];

async function loadProducts() {
    try {
        loadingSpinner.classList.remove('hidden');
        productsGrid.classList.add('hidden');
        emptyState.classList.add('hidden');

        const res = await fetch(`${API_BASE}/produtos`);
        if (!res.ok) throw new Error('Erro ao buscar produtos');
        const data = await res.json();
        allProducts = data;

        loadingSpinner.classList.add('hidden');

        if (data.length === 0) {
            emptyState.classList.remove('hidden');
            return;
        }

        renderProducts(data);
        productsGrid.classList.remove('hidden');
    } catch (error) {
        loadingSpinner.classList.add('hidden');
        showToast('Erro ao carregar produtos: ' + error.message, true);
    }
}

function renderProducts(products) {
    productsGrid.innerHTML = '';

    products.forEach(product => {
        const price = parseFloat(product.preco || 0).toFixed(2);
        const discount = parseFloat(product.percentualDesconto || 0).toFixed(1);
        const stock = parseInt(product.quantidade || 0);

        const card = document.createElement('div');
        card.className = 'card-base card-hover card-glow flex flex-col';
        card.innerHTML = `
      <div class="flex justify-between items-start mb-3">
        <h3 class="font-bold text-white truncate">${product.nome || 'Sem nome'}</h3>
        <span class="text-xs bg-brand/20 text-brand px-2 py-0.5 rounded font-semibold">ID ${product.codProduto || '-'}</span>
      </div>
      <p class="text-gray-400 text-xs mb-4 line-clamp-2">${product.descricao || 'Sem descrição'}</p>
      <div class="mt-auto space-y-1 text-sm">
        <div class="flex justify-between">
          <span class="text-gray-400">Preço</span>
          <span class="text-white font-semibold">R$ ${price}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-400">Desconto</span>
          <span class="text-white">${discount}%</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-400">Estoque</span>
          <span class="${stock < 10 ? 'text-red-400' : 'text-green-400'} font-bold">${stock} unid.</span>
        </div>
      </div>
    `;
        productsGrid.appendChild(card);
    });
}

// ============================================================
// BUSCA
// ============================================================
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase().trim();
        if (!term) {
            renderProducts(allProducts);
            productsGrid.classList.remove('hidden');
            emptyState.classList.add('hidden');
            return;
        }

        const filtered = allProducts.filter(p =>
            (p.nome && p.nome.toLowerCase().includes(term)) ||
            (p.descricao && p.descricao.toLowerCase().includes(term)) ||
            (p.marca && p.marca.toLowerCase().includes(term))
        );

        if (filtered.length === 0) {
            emptyState.classList.remove('hidden');
            productsGrid.classList.add('hidden');
        } else {
            emptyState.classList.add('hidden');
            renderProducts(filtered);
            productsGrid.classList.remove('hidden');
        }
    });
}

// ============================================================
// IMPORTAÇÃO EM LOTE
// ============================================================
async function importData(endpoint, btn, successMsg) {
    btn.disabled = true;
    const originalText = btn.textContent;
    btn.textContent = 'Carregando...';

    try {
        const res = await fetch(`${API_BASE}/${endpoint}`, { method: 'POST' });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Falha na importação');
        showToast(data.message || successMsg);
        if (endpoint === 'produtos/bulk') {
            await loadProducts();
        }
    } catch (err) {
        showToast(err.message, true);
    } finally {
        btn.disabled = false;
        btn.textContent = originalText;
    }
}

if (btnLoadProducts) {
    btnLoadProducts.addEventListener('click', () => {
        importData('produtos/bulk', btnLoadProducts, 'Produtos importados com sucesso!');
    });
}

if (btnLoadUsers) {
    btnLoadUsers.addEventListener('click', () => {
        importData('usuarios/bulk', btnLoadUsers, 'Usuários importados com sucesso!');
    });
}

// ============================================================
// ANIMAÇÕES (REVEAL)
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        },
        { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );
    reveals.forEach(el => observer.observe(el));

    // Carrega os produtos
    loadProducts();
});