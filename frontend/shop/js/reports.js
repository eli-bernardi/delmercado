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
    if (!toast) return;
    toast.textContent = message;
    if (isError) {
        toast.className = 'toast erro';
    } else {
        toast.className = 'toast sucesso';
    }
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
        toast.className = 'toast oculto';
    }, 4500);
}

// ============================================================
// LOAD CRITICAL PRODUCTS
// ============================================================
async function loadCriticalProducts() {
    if (!criticosBody) return;
    criticosBody.innerHTML = '';
    if (criticosSpinner) criticosSpinner.classList.remove('oculto');
    if (criticosEmpty) criticosEmpty.classList.add('oculto');

    try {
        const res = await fetch(`${API_BASE}/produtos-criticos`);
        if (!res.ok) throw new Error('Erro ao buscar produtos críticos');
        const data = await res.json();
        
        if (criticosSpinner) criticosSpinner.classList.add('oculto');

        if (data.length === 0) {
            if (criticosEmpty) criticosEmpty.classList.remove('oculto');
            return;
        }

        data.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.codigo_produto}</td>
                <td class="fonte-semi-negrito text-white">${item.nome}</td>
                <td>${item.categoria || '-'}</td>
                <td style="color:#facc15;font-weight:700;">${item.quantidade_atual} un.</td>
            `;
            criticosBody.appendChild(row);
        });
    } catch (err) {
        if (criticosSpinner) criticosSpinner.classList.add('oculto');
        if (criticosEmpty) {
            criticosEmpty.textContent = 'Erro ao carregar dados.';
            criticosEmpty.classList.remove('oculto');
        }
        showToast(err.message, true);
    }
}

// ============================================================
// LOAD VOLUME PURCHASED
// ============================================================
async function loadVolumePurchased() {
    if (!volumeBody) return;
    volumeBody.innerHTML = '';
    if (volumeSpinner) volumeSpinner.classList.remove('oculto');
    if (volumeEmpty) volumeEmpty.classList.add('oculto');

    try {
        const res = await fetch(`${API_BASE}/volume-compras`);
        if (!res.ok) throw new Error('Erro ao buscar volume de compras');
        const data = await res.json();
        
        if (volumeSpinner) volumeSpinner.classList.add('oculto');

        if (data.length === 0) {
            if (volumeEmpty) volumeEmpty.classList.remove('oculto');
            return;
        }

        data.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="fonte-semi-negrito text-white">${item.nome}</td>
                <td>${item.quantidade_total_movimentada} un.</td>
                <td style="color:#d62828;font-weight:900;">R$ ${parseFloat(item.valor_financeiro_movimentado).toFixed(2)}</td>
            `;
            volumeBody.appendChild(row);
        });
    } catch (err) {
        if (volumeSpinner) volumeSpinner.classList.add('oculto');
        if (volumeEmpty) {
            volumeEmpty.textContent = 'Erro ao carregar dados.';
            volumeEmpty.classList.remove('oculto');
        }
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