const API_BASE = 'http://localhost:3000';

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const btnLoadProducts = document.getElementById('btn-load-products');
  const btnLoadUsers = document.getElementById('btn-load-users');
  const toastMessage = document.getElementById('toast-message');
  const productsGrid = document.getElementById('products-grid');
  const loadingSpinner = document.getElementById('loading-spinner');
  const emptyState = document.getElementById('empty-state');
  const searchInput = document.getElementById('search-input');

  let allProducts = [];

  // Show status toasts
  function showToast(message, isError = false) {
    toastMessage.textContent = message;
    toastMessage.className = `mt-4 p-3 rounded-lg text-sm text-center font-semibold ${
      isError ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-green-500/20 text-green-400 border border-green-500/30'
    }`;
    toastMessage.classList.remove('hidden');
    setTimeout(() => {
      toastMessage.classList.add('hidden');
    }, 4000);
  }

  // Load products from local backend DB
  async function loadProducts() {
    loadingSpinner.classList.remove('hidden');
    productsGrid.classList.add('hidden');
    emptyState.classList.add('hidden');

    try {
      const res = await fetch(`${API_BASE}/produtos`);
      if (!res.ok) throw new Error('Erro ao obter produtos');
      allProducts = await res.json();
      renderProducts(allProducts);
    } catch (err) {
      console.error(err);
      showToast('Falha ao conectar ao servidor backend.', true);
      loadingSpinner.classList.add('hidden');
      emptyState.classList.remove('hidden');
    }
  }

  // Render product cards inside grid
  function renderProducts(products) {
    loadingSpinner.classList.add('hidden');
    
    if (products.length === 0) {
      productsGrid.classList.add('hidden');
      emptyState.classList.remove('hidden');
      return;
    }

    emptyState.classList.add('hidden');
    productsGrid.classList.remove('hidden');
    productsGrid.innerHTML = '';

    products.forEach(p => {
      const card = document.createElement('div');
      card.className = 'glass-panel rounded-xl overflow-hidden hover-scale border border-white/5 flex flex-col justify-between';
      
      // Calculate final price with discount
      const priceVal = parseFloat(p['Preço']);
      const discount = parseFloat(p['Percentual de desconto']) || 0;
      const finalPrice = discount > 0 ? (priceVal * (1 - discount / 100)) : priceVal;

      // Handle stock badge styling
      const stock = parseInt(p.Quantidade);
      let stockBadgeClass = 'bg-green-500/20 text-green-400';
      if (stock === 0) stockBadgeClass = 'bg-red-500/20 text-red-400';
      else if (stock < 10) stockBadgeClass = 'bg-yellow-500/20 text-yellow-400';

      card.innerHTML = `
        <div>
          <div class="h-44 w-full bg-neutral-900 flex items-center justify-center relative overflow-hidden">
            <img src="${p.Imagem || 'https://placehold.co/300x200?text=Sem+Imagem'}" alt="${p.Nome}" 
                 class="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                 onerror="this.src='https://placehold.co/300x200?text=Sem+Imagem';">
            ${discount > 0 ? `<span class="absolute top-2 right-2 bg-brand text-white text-xs font-bold px-2 py-0.5 rounded-full">-${discount.toFixed(0)}%</span>` : ''}
          </div>
          
          <div class="p-4">
            <div class="flex items-center justify-between gap-1 mb-1">
              <span class="text-xs text-gray-500 uppercase tracking-wider font-semibold">${p.Categoria || 'Geral'}</span>
              <span class="text-xs text-gray-500 font-medium">${p.Marca || 'Genérica'}</span>
            </div>
            
            <h3 class="font-bold text-white text-base truncate mb-2" title="${p.Nome}">${p.Nome}</h3>
            <p class="text-gray-400 text-xs line-clamp-2 mb-4" title="${p['Descrição'] || 'Sem descrição.'}">
              ${p['Descrição'] || 'Sem descrição disponível.'}
            </p>
          </div>
        </div>

        <div class="p-4 pt-0 border-t border-white/5 mt-auto">
          <div class="flex items-center justify-between my-3">
            <div class="flex flex-col">
              ${discount > 0 ? `<span class="text-gray-500 text-xs line-through">R$ ${priceVal.toFixed(2)}</span>` : ''}
              <span class="text-white font-extrabold text-lg">R$ ${finalPrice.toFixed(2)}</span>
            </div>
            <span class="text-xs font-bold px-2.5 py-1 rounded-full ${stockBadgeClass}">
              Estoque: ${stock}
            </span>
          </div>

          <a href="../../move/html/index.html?productId=${p.codProduto}&action=buy" 
             class="block text-center bg-white/5 hover:bg-brand text-white hover:text-white text-xs font-semibold py-2 px-3 rounded-lg border border-white/10 hover:border-brand transition-all duration-300">
            Realizar Movimentação
          </a>
        </div>
      `;
      productsGrid.appendChild(card);
    });
  }

  // Event: load products bulk
  btnLoadProducts.addEventListener('click', async () => {
    btnLoadProducts.disabled = true;
    btnLoadProducts.innerHTML = `<span class="animate-spin inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></span> Carregando...`;
    try {
      const res = await fetch(`${API_BASE}/produtos/bulk`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro no processamento');
      showToast(data.message);
      loadProducts();
    } catch (err) {
      showToast(err.message, true);
    } finally {
      btnLoadProducts.disabled = false;
      btnLoadProducts.innerHTML = 'Carreger Produtos';
    }
  });

  // Event: load users bulk
  btnLoadUsers.addEventListener('click', async () => {
    btnLoadUsers.disabled = true;
    btnLoadUsers.innerHTML = `<span class="animate-spin inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></span> Carregando...`;
    try {
      const res = await fetch(`${API_BASE}/usuarios/bulk`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro no processamento');
      showToast(data.message);
    } catch (err) {
      showToast(err.message, true);
    } finally {
      btnLoadUsers.disabled = false;
      btnLoadUsers.innerHTML = 'Carreger Usuários';
    }
  });

  // Search input filter
  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase().trim();
    if (!query) {
      renderProducts(allProducts);
      return;
    }
    const filtered = allProducts.filter(p => 
      p.Nome.toLowerCase().includes(query) || 
      (p.Categoria && p.Categoria.toLowerCase().includes(query)) ||
      (p.Marca && p.Marca.toLowerCase().includes(query))
    );
    renderProducts(filtered);
  });

  // Initial Load
  loadProducts();
});
