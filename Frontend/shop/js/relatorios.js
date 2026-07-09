// relatorios.js
const API_BASE = 'http://localhost:3000/compras/relatorios';
const toast = document.getElementById('reports-toast');

// Elements
const criticosBody = document.getElementById('criticos-table-body');
const criticosSpinner = document.getElementById('criticos-spinner');
const criticosEmpty = document.getElementById('criticos-empty');

const volumeBody = document.getElementById('volume-table-body');
const volumeSpinner = document.getElementById('volume-spinner');
const volumeEmpty = document.getElementById('volume-empty');

// ============================================================
// TOAST
// ============================================================
function showToast(message, isError = false) {
    toast.textContent = message;
    toast.className = `mb-6 p-3 rounded-lg text-sm text-center font-semibold ${isError
            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
            : 'bg-green-500/20 text-green-400 border border-green-500/30'
        }`;
    toast.classList.remove('hidden');
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => toast.classList.add('hidden'), 4000);
}

// ============================================================
// LOAD CRITICAL PRODUCTS
// ============================================================
async function loadCriticalProducts() {
    criticosBody.innerHTML = '';
    criticosSpinner.classList.remove('hidden');
    criticosEmpty.classList.add('hidden');

    try {
        const res = await fetch(`${API_BASE}/produtos-criticos`);
        if (!res.ok) throw new Error('Erro ao buscar produtos críticos');
        const data = await res.json();
        criticosSpinner.classList.add('hidden');

        if (data.length === 0) {
            criticosEmpty.classList.remove('hidden');
            return;
        }

        data.forEach(item => {
            const row = document.createElement('tr');
            row.className = 'hover:bg-white/5 transition-colors border-b border-white/5';
            row.innerHTML = `
        <td class="px-4 py-3 font-mono text-gray-400">${item.codigo_produto}</td>
        <td class="px-4 py-3 font-semibold text-white">${item.nome}</td>
        <td class="px-4 py-3 text-gray-300">${item.categoria || '-'}</td>
        <td class="px-4 py-3 font-bold text-yellow-400">${item.quantidade_atual}</td>
      `;
            criticosBody.appendChild(row);
        });
    } catch (err) {
        criticosSpinner.classList.add('hidden');
        criticosEmpty.textContent = 'Erro ao carregar dados.';
        criticosEmpty.classList.remove('hidden');
        showToast(err.message, true);
    }
}

// ============================================================
// LOAD VOLUME PURCHASED
// ============================================================
async function loadVolumePurchased() {
    volumeBody.innerHTML = '';
    volumeSpinner.classList.remove('hidden');
    volumeEmpty.classList.add('hidden');

    try {
        const res = await fetch(`${API_BASE}/volume-compras`);
        if (!res.ok) throw new Error('Erro ao buscar volume de compras');
        const data = await res.json();
        volumeSpinner.classList.add('hidden');

        if (data.length === 0) {
            volumeEmpty.classList.remove('hidden');
            return;
        }

        data.forEach(item => {
            const row = document.createElement('tr');
            row.className = 'hover:bg-white/5 transition-colors border-b border-white/5';
            row.innerHTML = `
        <td class="px-4 py-3 font-semibold text-white">${item.nome}</td>
        <td class="px-4 py-3 text-gray-300 font-bold">${item.quantidade_total_movimentada}</td>
        <td class="px-4 py-3 font-black text-brand text-sm">R$ ${parseFloat(item.valor_financeiro_movimentado).toFixed(2)}</td>
      `;
            volumeBody.appendChild(row);
        });
    } catch (err) {
        volumeSpinner.classList.add('hidden');
        volumeEmpty.textContent = 'Erro ao carregar dados.';
        volumeEmpty.classList.remove('hidden');
        showToast(err.message, true);
    }
}

// ============================================================
// INITIALIZE
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    loadCriticalProducts();
    loadVolumePurchased();
});