// product.js — Lógica de CRUD para Produtos
const API_URL = 'http://localhost:3000';

const tbody = document.getElementById('products-table-body');
const spinner = document.getElementById('table-spinner');
const emptyState = document.getElementById('table-empty');
const productForm = document.getElementById('product-form');
const hiddenId = document.getElementById('product-id');

// Elementos do formulário
const inputNome = document.getElementById('prod-nome');
const inputMarca = document.getElementById('prod-marca');
const inputDescricao = document.getElementById('prod-descricao');
const inputCategoria = document.getElementById('prod-categoria');
const inputPreco = document.getElementById('prod-preco');
const inputDesconto = document.getElementById('prod-desconto');
const inputQuantidade = document.getElementById('prod-quantidade');
const inputImagem = document.getElementById('prod-imagem');

// Listar produtos
async function listarProdutos() {
  if (!tbody) return;
  tbody.innerHTML = '';
  if (spinner) spinner.classList.remove('oculto');
  if (emptyState) emptyState.classList.add('oculto');

  try {
    const res = await fetch(`${API_URL}/produtos`);
    if (!res.ok) throw new Error('Erro ao carregar produtos');
    const dados = await res.json();

    if (spinner) spinner.classList.add('oculto');

    if (dados.length === 0) {
      if (emptyState) emptyState.classList.remove('oculto');
      return;
    }

    dados.forEach(prod => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${prod.codProduto}</td>
        <td><img src="${prod.Imagem || prod.imagem}" alt="${prod.Nome || prod.nome}" style="width:50px;height:50px;object-fit:cover;border-radius:8px;"></td>
        <td>
          <div class="fonte-semi-negrito text-white">${prod.Nome || prod.nome || 'Sem nome'}</div>
          <div class="texto-xs texto-cinza-400">${prod.Marca || prod.marca || 'Sem marca'}</div>
        </td>
        <td>${prod.Categoria || prod.categoria}</td>
        <td>R$ ${parseFloat(prod.Preco || prod.preco || 0).toFixed(2)}</td>
        <td>${parseFloat(prod.PercentualDesconto || prod.percentualDesconto || 0).toFixed(1)}%</td>
        <td>
          <span class="${parseInt(prod.Quantidade || prod.quantidade || 0) < 10 ? 'texto-vermelho-400' : 'texto-verde-400'} fonte-negrito">
            ${prod.Quantidade !== undefined ? prod.Quantidade : prod.quantidade} un.
          </span>
        </td>
        <td class="texto-direita acoes-tabela">
          <button class="btn-editar-tabela" onclick="editarProduto(${prod.codProduto})">
            <i class="fa-solid fa-pen"></i>
          </button>
          <button class="btn-excluir-tabela" onclick="excluirProduto(${prod.codProduto})">
            <i class="fa-solid fa-trash"></i>
          </button>
        </td>
      `;
      tbody.appendChild(row);
    });
  } catch (err) {
    console.error('Erro ao listar produtos:', err);
    if (spinner) spinner.classList.add('oculto');
    if (emptyState) {
      emptyState.textContent = 'Erro ao carregar os dados.';
      emptyState.classList.remove('oculto');
    }
  }
}

// Abrir formulário para edição
async function editarProduto(id) {
  try {
    const res = await fetch(`${API_URL}/produtos/${id}`);
    if (!res.ok) throw new Error('Erro ao buscar produto');
    const prod = await res.json();

    if (hiddenId) hiddenId.value = prod.codProduto;
    if (inputNome) inputNome.value = prod.Nome || prod.nome || '';
    if (inputMarca) inputMarca.value = prod.Marca || prod.marca || '';
    if (inputDescricao) inputDescricao.value = prod.Descricao || prod.descricao || '';
    if (inputCategoria) inputCategoria.value = prod.Categoria || prod.categoria || '';
    if (inputPreco) inputPreco.value = prod.Preco !== undefined ? prod.Preco : prod.preco;
    if (inputDesconto) inputDesconto.value = prod.PercentualDesconto !== undefined ? prod.PercentualDesconto : prod.percentualDesconto;
    if (inputQuantidade) inputQuantidade.value = prod.Quantidade !== undefined ? prod.Quantidade : prod.quantidade;
    if (inputImagem) inputImagem.value = prod.Imagem || prod.imagem || '';

    // Utiliza a função global exposta em main.js para rolar e abrir
    if (typeof window.abrirFormCadastro === 'function') {
      window.abrirFormCadastro();
      const formTitle = document.getElementById('form-title');
      if (formTitle) formTitle.textContent = 'Editar Produto';
    }
  } catch (err) {
    console.error('Erro ao editar produto:', err);
    if (typeof window.showToast === 'function') {
      window.showToast('Erro ao buscar dados do produto.', true);
    }
  }
}

// Salvar / Atualizar produto
if (productForm) {
  productForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = hiddenId.value;
    const produto = {
      Nome: inputNome.value,
      Marca: inputMarca.value,
      Descricao: inputDescricao.value,
      Categoria: inputCategoria.value,
      Preco: parseFloat(inputPreco.value),
      PercentualDesconto: parseFloat(inputDesconto.value),
      Quantidade: parseInt(inputQuantidade.value),
      Imagem: inputImagem.value
    };

    const isEdit = !!id;
    const url = isEdit ? `${API_URL}/produtos/${id}` : `${API_URL}/produtos`;
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(produto)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Erro ao salvar produto.');

      if (typeof window.showToast === 'function') {
        window.showToast(data.message || 'Produto salvo com sucesso!');
      }

      if (typeof window.fecharForm === 'function') {
        window.fecharForm();
      }

      listarProdutos();
    } catch (err) {
      console.error('Erro ao salvar produto:', err);
      if (typeof window.showToast === 'function') {
        window.showToast(err.message, true);
      }
    }
  });
}

// Excluir produto
async function excluirProduto(id) {
  if (!confirm('Deseja realmente excluir este produto?')) return;

  try {
    const res = await fetch(`${API_URL}/produtos/${id}`, {
      method: 'DELETE'
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Erro ao excluir produto.');

    if (typeof window.showToast === 'function') {
      window.showToast(data.message || 'Produto excluído com sucesso!');
    }
    listarProdutos();
  } catch (err) {
    console.error('Erro ao excluir produto:', err);
    if (typeof window.showToast === 'function') {
      window.showToast(err.message, true);
    }
  }
}

// Expor globalmente para os botões de ação na tabela
window.editarProduto = editarProduto;
window.excluirProduto = excluirProduto;

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  listarProdutos();
});
