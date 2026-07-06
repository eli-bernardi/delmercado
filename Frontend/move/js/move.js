const API_BASE = 'http://localhost:3000';

const form = document.getElementById('movement-form');
const selectUsuario = document.getElementById('move-usuario');
const selectProduto = document.getElementById('move-produto');
const inputQuantidade = document.getElementById('move-quantidade');
const selectPagamento = document.getElementById('move-pagamento');
const selectStatus = document.getElementById('move-status');
const stockHint = document.getElementById('product-stock-hint');

// Preview values
const previewPreco = document.getElementById('preview-preco');
const previewDesconto = document.getElementById('preview-desconto');
const previewFinal = document.getElementById('preview-final');

const toast = document.getElementById('move-toast');
const tableBody = document.getElementById('movements-table-body');
const tableSpinner = document.getElementById('table-spinner');
const tableEmpty = document.getElementById('table-empty');

let productsList = [];
let selectedProd = null;

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
    toast.textContent = message;
    toast.className = `mb-6 p-3 rounded-lg text-sm text-center font-semibold ${
        isError ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-green-500/20 text-green-400 border border-green-500/30'
    }`;
    toast.classList.remove('hidden');
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 5500);
}

// ---------- Load selects ----------
async function loadFormSelects() {
    try {
        // Fetch Users
        const resUsers = await fetch(`${API_BASE}/usuarios`);
        const users = await resUsers.json();
        users.forEach(u => {
            const opt = document.createElement('option');
            opt.value = u.codUsuario;
            opt.textContent = `${u.Nome} ${u.Sobrenome} (ID: ${u.codUsuario})`;
            selectUsuario.appendChild(opt);
        });

        // Fetch Products
        const resProds = await fetch(`${API_BASE}/produtos`);
        productsList = await resProds.json();
        productsList.forEach(p => {
            const opt = document.createElement('option');
            opt.value = p.codProduto;
            opt.textContent = `${p.Nome} (Estoque: ${p.Quantidade})`;
            selectProduto.appendChild(opt);
        });

        // Query param pre-select product
        const urlParams = new URLSearchParams(window.location.search);
        const preSelectedProdId = urlParams.get('productId');
        if (preSelectedProdId) {
            selectProduto.value = preSelectedProdId;
            handleProductChange();
        }
    } catch (err) {
        showToast('Erro ao carregar seletores do formulário.', true);
    }
}

// ---------- Product change ----------
function handleProductChange() {
    const prodId = selectProduto.value;
    selectedProd = productsList.find(p => p.codProduto == prodId);
    if (selectedProd) {
        const stock = parseInt(selectedProd.Quantidade);
        stockHint.textContent = `Quantidade em estoque atual: ${stock}`;
        previewPreco.textContent = `R$ ${parseFloat(selectedProd['Preço']).toFixed(2)}`;
        previewDesconto.textContent = `${parseFloat(selectedProd['Percentual de desconto'] || 0).toFixed(1)}%`;
        updateCalculations();
    } else {
        stockHint.textContent = '';
        previewPreco.textContent = '-';
        previewDesconto.textContent = '-';
        previewFinal.textContent = '-';
    }
}

function updateCalculations() {
    if (!selectedProd) return;
    const qty = parseInt(inputQuantidade.value) || 0;
    const price = parseFloat(selectedProd['Preço']);
    const desc = parseFloat(selectedProd['Percentual de desconto']) || 0;
    const finalVal = (price * (1 - desc / 100)) * qty;
    previewFinal.textContent = `R$ ${finalVal.toFixed(2)}`;
}

selectProduto.addEventListener('change', handleProductChange);
inputQuantidade.addEventListener('input', updateCalculations);

// ---------- Load movements table ----------
async function loadMovementsLogs() {
    tableSpinner.classList.remove('hidden');
    tableEmpty.classList.add('hidden');
    tableBody.innerHTML = '';

    try {
        const res = await fetch(`${API_BASE}/compras`);
        if (!res.ok) throw new Error();
        const logs = await res.json();
        tableSpinner.classList.add('hidden');

        if (logs.length === 0) {
            tableEmpty.classList.remove('hidden');
            return;
        }

        logs.forEach(l => {
            const row = document.createElement('tr');
            row.className = 'hover:bg-white/5 transition-colors border-b border-white/5';

            const formattedDate = new Date(l.dataCompra).toLocaleString('pt-BR');
            const isSaida = l.tipoMovimento === 'SAIDA';
            const typeBadge = isSaida
                ? '<span class="bg-red-500/20 text-red-400 border border-red-500/20 px-2 py-0.5 rounded font-bold">SAÍDA</span>'
                : '<span class="bg-green-500/20 text-green-400 border border-green-500/20 px-2 py-0.5 rounded font-bold">ENTRADA</span>';

            row.innerHTML = `
                <td class="px-4 py-3 text-gray-400">${formattedDate}</td>
                <td class="px-4 py-3 font-semibold">${typeBadge}</td>
                <td class="px-4 py-3 text-gray-300 font-medium">${l.usuario ? l.usuario.Nome + ' ' + l.usuario.Sobrenome : 'Desconhecido'}</td>
                <td class="px-4 py-3 text-gray-300 truncate max-w-[120px]" title="${l.produto ? l.produto.Nome : ''}">${l.produto ? l.produto.Nome : 'Desconhecido'}</td>
                <td class="px-4 py-3 font-semibold">${l.quantidadeMovimentada}</td>
                <td class="px-4 py-3 font-extrabold text-white">R$ ${parseFloat(l.precoFinal).toFixed(2)}</td>
                <td class="px-4 py-3 text-gray-400">${l.formaPagamento}</td>
                <td class="px-4 py-3">
                    <span class="px-2 py-0.5 rounded font-semibold text-[10px] ${
                        l.statusCompra === 'PAGA' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                    }">${l.statusCompra}</span>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (err) {
        tableSpinner.classList.add('hidden');
        tableEmpty.textContent = 'Erro ao carregar histórico.';
        tableEmpty.classList.remove('hidden');
    }
}

// ---------- Submit movement ----------
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const typeInput = document.querySelector('input[name="tipoMovimento"]:checked');

    const payload = {
        codUsuario: parseInt(selectUsuario.value, 10),
        codProduto: parseInt(selectProduto.value, 10),
        tipoMovimento: typeInput.value,
        quantidadeMovimentada: parseInt(inputQuantidade.value, 10),
        formaPagamento: selectPagamento.value,
        statusCompra: selectStatus.value
    };

    try {
        const res = await fetch(`${API_BASE}/compras`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Erro ao registrar movimento');

        showToast('Movimentação registrada com sucesso!');
        form.reset();
        selectedProd = null;
        stockHint.textContent = '';
        previewPreco.textContent = '-';
        previewDesconto.textContent = '-';
        previewFinal.textContent = '-';

        // Reload all
        loadMovementsLogs();
        // Reload products list in cache to reflect new stocks
        const resProds = await fetch(`${API_BASE}/produtos`);
        productsList = await resProds.json();
    } catch (err) {
        showToast(err.message, true);
    }
});

// ---------- Initialize ----------
loadFormSelects();
loadMovementsLogs();