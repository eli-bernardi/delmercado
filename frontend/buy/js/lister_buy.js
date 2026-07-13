// lister_buy.js
const API_BASE_LIST = 'http://localhost:3000';

const tbody = document.getElementById('movements-table-body');
const spinner = document.getElementById('table-spinner');
const emptyState = document.getElementById('table-empty');

async function listarCompras() {
    if (!tbody) return;

    tbody.innerHTML = '';
    if (spinner) spinner.classList.remove('oculto');
    if (emptyState) emptyState.classList.add('oculto');

    try {
        const res = await fetch(`${API_BASE_LIST}/compras`);
        if (!res.ok) throw new Error('Erro ao carregar movimentações');
        const dados = await res.json();

        if (spinner) spinner.classList.add('oculto');

        if (dados.length === 0) {
            if (emptyState) emptyState.classList.remove('oculto');
            return;
        }

        dados.forEach(el => {
            const row = document.createElement('tr');
            
            const dataFormatada = new Date(el.dataCompra).toLocaleString('pt-BR');
            const tipoBadge = el.tipoMovimento === 'SAIDA'
                ? '<span style="color:#f87171;font-weight:700;">SAÍDA</span>'
                : '<span style="color:#4ade80;font-weight:700;">ENTRADA</span>';
            const statusBadge = el.status === 'PAGA'
                ? '<span style="color:#4ade80;font-weight:700;">PAGA</span>'
                : '<span style="color:#facc15;font-weight:700;">PENDENTE</span>';

            const userNome = el.usuario ? `${el.usuario.nome} ${el.usuario.sobrenome}` : 'Desconhecido';
            const prodNome = el.produto ? el.produto.nome : 'Desconhecido';

            row.innerHTML = `
                <td>${dataFormatada}</td>
                <td>${tipoBadge}</td>
                <td>${userNome}</td>
                <td>${prodNome}</td>
                <td>${el.quantidadeMovimentada}</td>
                <td>R$ ${parseFloat(el.precoFinal || 0).toFixed(2)}</td>
                <td>${el.formaPagamento || '-'}</td>
                <td>${statusBadge}</td>
            `;
            tbody.appendChild(row);
        });
    } catch (err) {
        console.error('Erro ao listar as movimentações', err);
        if (spinner) spinner.classList.add('oculto');
        if (emptyState) {
            emptyState.textContent = 'Erro ao carregar o histórico.';
            emptyState.classList.remove('oculto');
        }
    }
}

// Expor globalmente para permitir atualização pós-cadastro
window.listarCompras = listarCompras;

document.addEventListener('DOMContentLoaded', () => {
    listarCompras();
});