const API_BASE = 'http://localhost:3000'; // URL base do backend local

// ---------- Mobile menu toggle ----------
const menuToggle = document.getElementById('menu-toggle');
const menu = document.getElementById('menu');
if (menuToggle && menu) {
    menuToggle.addEventListener('click', () => {
        menu.classList.toggle('hidden');
    });
}

// ---------- Toast ----------
function showToast(message, isError = false) {
    const toast = document.getElementById('toast-message');
    if (!toast) return;
    toast.textContent = message;
    toast.className = `mt-4 p-3 rounded-lg text-sm text-center font-semibold ${isError ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-green-500/20 text-green-400 border border-green-500/30'
        }`;
    toast.classList.remove('hidden');
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 5000);
}

// ---------- Load Products Grid ----------
let allProducts = [];

async function loadProducts() {
    const spinner = document.getElementById('loading-spinner');
    const grid = document.getElementById('products-grid');
    const emptyState = document.getElementById('empty-state');

    try {
        spinner.classList.remove('hidden');
        grid.classList.add('hidden');
        emptyState.classList.add('hidden');

        const response = await fetch(`${API_BASE}/produtos`);
        if (!response.ok) throw new Error('Erro ao buscar produtos');
        const products = await response.json();
        allProducts = products;

        spinner.classList.add('hidden');
        if (products.length === 0) {
            emptyState.classList.remove('hidden');
            return;
        }

        renderProducts(products);
        grid.classList.remove('hidden');
    } catch (error) {
        spinner.classList.add('hidden');
        showToast('Erro ao carregar produtos: ' + error.message, true);
    }
}

function renderProducts(products) {
    const grid = document.getElementById('products-grid');
    grid.innerHTML = '';

    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'bg-white/5 rounded-xl border border-white/10 p-4 hover:border-brand/50 transition-all duration-300 flex flex-col';

        const price = parseFloat(product['Preço']).toFixed(2);
        const discount = parseFloat(product['Percentual de desconto'] || 0).toFixed(1);
        const stock = parseInt(product.Quantidade);

        card.innerHTML = `
            <div class="flex justify-between items-start mb-3">
                <h3 class="font-bold text-white truncate">${product.Nome}</h3>
                <span class="text-xs bg-brand/20 text-brand px-2 py-0.5 rounded font-semibold">ID ${product.codProduto}</span>
            </div>
            <p class="text-gray-400 text-xs mb-4 line-clamp-2">${product.Descrição || 'Sem descrição'}</p>
            <div class="mt-auto space-y-1 text-sm">
                <div class="flex justify-between">
                    <span class="text-gray-500">Preço</span>
                    <span class="text-white font-semibold">R$ ${price}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-500">Desconto</span>
                    <span class="text-white">${discount}%</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-500">Estoque</span>
                    <span class="${stock < 10 ? 'text-red-400' : 'text-green-400'} font-bold">${stock} unid.</span>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// ---------- Search ----------
const searchInput = document.getElementById('search-input');
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase().trim();
        const filtered = allProducts.filter(p =>
            p.Nome.toLowerCase().includes(term) ||
            (p.Descrição && p.Descrição.toLowerCase().includes(term))
        );
        renderProducts(filtered);
        if (filtered.length === 0) {
            document.getElementById('empty-state').classList.remove('hidden');
            document.getElementById('products-grid').classList.add('hidden');
        } else {
            document.getElementById('empty-state').classList.add('hidden');
            document.getElementById('products-grid').classList.remove('hidden');
        }
    });
}

// ---------- Load External Data Buttons ----------
document.getElementById('btn-load-products').addEventListener('click', async () => {
    const btn = document.getElementById('btn-load-products');
    btn.disabled = true;
    btn.innerHTML = 'Carregando...';
    try {
        const response = await fetch(`${API_BASE}/produtos/importar`, { method: 'POST' });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Falha na importação');
        showToast(data.message || 'Produtos importados com sucesso!');
        await loadProducts(); // Recarrega a grid
    } catch (err) {
        showToast(err.message, true);
    } finally {
        btn.disabled = false;
        btn.innerHTML = 'Carregar Produtos';
    }
});

document.getElementById('btn-load-users').addEventListener('click', async () => {
    const btn = document.getElementById('btn-load-users');
    btn.disabled = true;
    btn.innerHTML = 'Carregando...';
    try {
        const response = await fetch(`${API_BASE}/usuarios/importar`, { method: 'POST' });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Falha na importação');
        showToast(data.message || 'Usuários importados com sucesso!');
    } catch (err) {
        showToast(err.message, true);
    } finally {
        btn.disabled = false;
        btn.innerHTML = 'Carregar Usuários';
    }
});

// ---------- Initialize ----------
loadProducts();