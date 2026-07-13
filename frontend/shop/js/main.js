// main.js — Produtos CRUD
const API = 'http://localhost:3000';

// ─── ELEMENTOS ─────────────────────────────────────────────────
const tbody       = document.getElementById('products-table-body');
const spinner     = document.getElementById('table-spinner');
const emptyState  = document.getElementById('table-empty');
const toast       = document.getElementById('crud-toast');
const formSection = document.getElementById('form-container');
const formTitle   = document.getElementById('form-title');
const form        = document.getElementById('product-form');
const hiddenId    = document.getElementById('product-id');
const btnShowForm = document.getElementById('btn-show-form');
const btnCancel   = document.getElementById('btn-cancel');
const btnFormCancel = document.getElementById('btn-form-cancel');

// Campos do formulário
const fNome        = document.getElementById('prod-nome');
const fMarca       = document.getElementById('prod-marca');
const fDescricao   = document.getElementById('prod-descricao');
const fCategoria   = document.getElementById('prod-categoria');
const fPreco       = document.getElementById('prod-preco');
const fDesconto    = document.getElementById('prod-desconto');
const fQuantidade  = document.getElementById('prod-quantidade');
const fImagem      = document.getElementById('prod-imagem');

// ─── TOAST ──────────────────────────────────────────────────────
function showToast(msg, erro = false) {
  if (!toast) return;
  toast.textContent = msg;
  toast.className = `mb-6 p-3 rounded-lg text-sm font-semibold text-center ${
    erro
      ? 'bg-red-500/20 text-red-400 border border-red-500/30'
      : 'bg-green-500/20 text-green-400 border border-green-500/30'
  }`;
  toast.classList.remove('hidden');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => toast.classList.add('hidden'), 4000);
}

// ─── LISTAR ─────────────────────────────────────────────────────
async function listarProdutos() {
  if (!tbody) return;
  tbody.innerHTML = '';
  if (spinner) spinner.classList.remove('hidden');
  if (emptyState) emptyState.classList.add('hidden');

  try {
    const res = await fetch(`${API}/produtos`);
    if (!res.ok) throw new Error('Falha ao carregar produtos');
    const dados = await res.json();

    if (spinner) spinner.classList.add('hidden');

    if (!dados.length) {
      if (emptyState) emptyState.classList.remove('hidden');
      return;
    }

    dados.forEach(p => {
      const tr = document.createElement('tr');
      const estoqueClass = p.quantidade < 10 ? 'text-red-400 font-bold' : 'text-green-400 font-bold';
      tr.innerHTML = `
        <td class="px-4 py-3 font-mono text-gray-400">${p.codProduto}</td>
        <td class="px-4 py-3">
          <img src="${p.imagem}" alt="${p.nome}" class="w-12 h-12 object-cover rounded-lg">
        </td>
        <td class="px-4 py-3">
          <p class="font-semibold text-white">${p.nome}</p>
          <p class="text-xs text-gray-400">${p.marca || '-'}</p>
        </td>
        <td class="px-4 py-3 text-gray-300">${p.categoria}</td>
        <td class="px-4 py-3 text-white font-semibold">R$ ${parseFloat(p.preco).toFixed(2)}</td>
        <td class="px-4 py-3 text-gray-300">${parseFloat(p.percentualDesconto).toFixed(1)}%</td>
        <td class="px-4 py-3 ${estoqueClass}">${p.quantidade}</td>
        <td class="px-4 py-3 text-right">
          <button onclick="editarProduto(${p.codProduto})" class="text-brand hover:text-white transition-colors text-sm mr-3">Editar</button>
          <button onclick="excluirProduto(${p.codProduto})" class="text-red-400 hover:text-red-200 transition-colors text-sm">Excluir</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    if (spinner) spinner.classList.add('hidden');
    showToast(err.message, true);
  }
}

// ─── ABRIR / FECHAR FORMULÁRIO ──────────────────────────────────
function abrirFormCadastro() {
  if (!formSection) return;
  hiddenId.value = '';
  form.reset();
  if (formTitle) formTitle.textContent = 'Cadastrar Novo Produto';
  formSection.classList.remove('hidden');
  formSection.scrollIntoView({ behavior: 'smooth' });
}

function fecharForm() {
  if (!formSection) return;
  formSection.classList.add('hidden');
  form.reset();
  hiddenId.value = '';
}

if (btnShowForm) btnShowForm.addEventListener('click', abrirFormCadastro);
if (btnCancel) btnCancel.addEventListener('click', fecharForm);
if (btnFormCancel) btnFormCancel.addEventListener('click', fecharForm);

// ─── CADASTRAR / ATUALIZAR ──────────────────────────────────────
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = hiddenId.value;
    const payload = {
      nome: fNome.value,
      marca: fMarca.value,
      descricao: fDescricao.value,
      categoria: fCategoria.value,
      preco: parseFloat(fPreco.value) || 0,
      percentualDesconto: parseFloat(fDesconto.value) || 0,
      quantidade: parseInt(fQuantidade.value) || 0,
      imagem: fImagem.value
    };

    try {
      const res = id
        ? await fetch(`${API}/produtos/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
        : await fetch(`${API}/produtos`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Erro ao salvar produto');

      showToast(id ? 'Produto atualizado com sucesso!' : 'Produto cadastrado com sucesso!');
      fecharForm();
      listarProdutos();
    } catch (err) {
      showToast(err.message, true);
    }
  });
}

// ─── EDITAR ─────────────────────────────────────────────────────
async function editarProduto(id) {
  try {
    const res = await fetch(`${API}/produtos/${id}`);
    if (!res.ok) throw new Error('Produto não encontrado');
    const p = await res.json();

    hiddenId.value = p.codProduto;
    fNome.value = p.nome || '';
    fMarca.value = p.marca || '';
    fDescricao.value = p.descricao || '';
    fCategoria.value = p.categoria || '';
    fPreco.value = p.preco || 0;
    fDesconto.value = p.percentualDesconto || 0;
    fQuantidade.value = p.quantidade || 0;
    fImagem.value = p.imagem || '';

    if (formTitle) formTitle.textContent = `Editar Produto #${id}`;
    formSection.classList.remove('hidden');
    formSection.scrollIntoView({ behavior: 'smooth' });
  } catch (err) {
    showToast(err.message, true);
  }
}

// ─── EXCLUIR ─────────────────────────────────────────────────────
async function excluirProduto(id) {
  if (!confirm(`Deseja excluir o produto #${id}?`)) return;
  try {
    const res = await fetch(`${API}/produtos/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Erro ao excluir');
    showToast('Produto excluído com sucesso!');
    listarProdutos();
  } catch (err) {
    showToast(err.message, true);
  }
}

// ─── INICIALIZAÇÃO ───────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', listarProdutos);