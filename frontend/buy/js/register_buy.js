// register_buy.js
const API_BASE = 'http://localhost:3000';

// Elementos do DOM
const userSelect = document.getElementById('move-usuario');
const prodSelect = document.getElementById('move-produto');
const qtdInput = document.getElementById('move-quantidade');
const pagamentoSelect = document.getElementById('move-pagamento');
const statusSelect = document.getElementById('move-status');
const form = document.getElementById('movement-form');
const toast = document.getElementById('move-toast');

// Previsualização
const previewPreco = document.getElementById('preview-preco');
const previewDesconto = document.getElementById('preview-desconto');
const previewFinal = document.getElementById('preview-final');
const stockHint = document.getElementById('product-stock-hint');

// Exibir Notificação (Toast)
function showToast(message, isError = false) {
    if (!toast) return;
    toast.textContent = message;
    toast.className = `toast ${isError ? 'erro' : 'sucesso'}`;
    toast.classList.add('visivel');
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => toast.classList.remove('visivel'), 4000);
}

// Carregar Opções de Usuários e Produtos
async function carregarOpcoes() {
    try {
        if (!userSelect || !prodSelect) return;

        // Carrega Usuários
        const resUsers = await fetch(`${API_BASE}/usuarios`);
        if (!resUsers.ok) throw new Error('Erro ao carregar usuários');
        const users = await resUsers.json();
        userSelect.innerHTML = '<option value="">Selecione um usuário...</option>';
        users.forEach(u => {
            const opt = document.createElement('option');
            opt.value = u.codUsuario;
            opt.textContent = `${u.nome} ${u.sobrenome} (ID: ${u.codUsuario})`;
            userSelect.appendChild(opt);
        });

        // Carrega Produtos
        const resProds = await fetch(`${API_BASE}/produtos`);
        if (!resProds.ok) throw new Error('Erro ao carregar produtos');
        const prods = await resProds.json();
        prodSelect.innerHTML = '<option value="">Selecione um produto...</option>';
        prods.forEach(p => {
            const opt = document.createElement('option');
            opt.value = p.codProduto;
            const nome = p.nome;
            const quantidade = p.quantidade;
            const preco = p.preco;
            const desconto = p.percentualDesconto;

            opt.textContent = `${nome} (Qtd: ${quantidade}) - R$ ${parseFloat(preco).toFixed(2)}`;
            // Armazena dados extras para o cálculo da prévia
            opt.dataset.preco = preco;
            opt.dataset.desconto = desconto;
            opt.dataset.quantidade = quantidade;
            prodSelect.appendChild(opt);
        });
    } catch (err) {
        console.error('Erro ao popular selects:', err);
        showToast('Não foi possível carregar as opções de produtos/usuários.', true);
    }
}

// Atualizar a visualização em tempo real do preço estimado
function atualizarPrevia() {
    const opt = prodSelect.options[prodSelect.selectedIndex];
    const qtd = parseInt(qtdInput.value) || 0;

    if (!opt || !opt.value) {
        if (previewPreco) previewPreco.textContent = '-';
        if (previewDesconto) previewDesconto.textContent = '-';
        if (previewFinal) previewFinal.textContent = '-';
        if (stockHint) stockHint.textContent = '';
        return;
    }

    const preco = parseFloat(opt.dataset.preco);
    const desconto = parseFloat(opt.dataset.desconto) || 0;
    const estoque = parseInt(opt.dataset.quantidade);

    if (previewPreco) previewPreco.textContent = `R$ ${preco.toFixed(2)}`;
    if (previewDesconto) previewDesconto.textContent = `${desconto.toFixed(1)}%`;
    if (stockHint) stockHint.textContent = `Estoque disponível: ${estoque} un.`;

    if (qtd > 0) {
        const precoComDesconto = preco * (1 - desconto / 100);
        const total = precoComDesconto * qtd;
        if (previewFinal) previewFinal.textContent = `R$ ${total.toFixed(2)}`;
    } else {
        if (previewFinal) previewFinal.textContent = '-';
    }
}

// Event Listeners para Prévia
if (prodSelect) prodSelect.addEventListener('change', atualizarPrevia);
if (qtdInput) qtdInput.addEventListener('input', atualizarPrevia);

// Submissão do Formulário
if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const codUsuario = parseInt(userSelect.value);
        const codProduto = parseInt(prodSelect.value);
        const tipoMovimento = document.querySelector('input[name="tipoMovimento"]:checked').value;
        const quantidadeMovimentada = parseInt(qtdInput.value);
        const formaPagamento = pagamentoSelect.value;
        const statusCompra = statusSelect.value;

        const opt = prodSelect.options[prodSelect.selectedIndex];
        const estoque = parseInt(opt.dataset.quantidade);

        // Validação de saldo no client-side
        if (tipoMovimento === 'SAIDA' && estoque < quantidadeMovimentada) {
            showToast('Quantidade indisponível no estoque!', true);
            return;
        }

        const payload = {
            codUsuario,
            codProduto,
            tipoMovimento,
            quantidadeMovimentada,
            formaPagamento,
            statusCompra
        };

        try {
            const res = await fetch(`${API_BASE}/compra`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Erro ao registrar compra.');

            showToast('Compra registrada com sucesso!');
            form.reset();
            atualizarPrevia();
            
            // Recarregar os selects (para atualizar os estoques das opções)
            await carregarOpcoes();
            
            // Se a listagem de compras existir na página, recarrega-la
            if (typeof window.listarCompras === 'function') {
                window.listarCompras();
            }
        } catch (err) {
            showToast(err.message, true);
        }
    });
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    carregarOpcoes();
});