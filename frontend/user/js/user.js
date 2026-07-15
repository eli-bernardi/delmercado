// user.js — Lógica de CRUD para Usuários
const API_URL = 'http://localhost:3000';

const tbody = document.getElementById('users-table-body');
const spinner = document.getElementById('table-spinner');
const emptyState = document.getElementById('table-empty');
const userForm = document.getElementById('user-form');
const hiddenId = document.getElementById('user-id');

// Elementos do formulário
const inputNome = document.getElementById('nome');
const inputSobrenome = document.getElementById('sobrenome');
const inputIdade = document.getElementById('idade');
const inputEmail = document.getElementById('email');
const inputTelefone = document.getElementById('telefone');
const inputEndereco = document.getElementById('endereco');
const inputCidade = document.getElementById('cidade');
const inputEstado = document.getElementById('estado');

// Listar usuários
async function listarUsuarios() {
  if (!tbody) return;
  tbody.innerHTML = '';
  if (spinner) spinner.classList.remove('oculto');
  if (emptyState) emptyState.classList.add('oculto');

  try {
    const res = await fetch(`${API_URL}/usuarios`);
    if (!res.ok) throw new Error('Erro ao carregar usuários');
    const dados = await res.json();

    if (spinner) spinner.classList.add('oculto');

    if (dados.length === 0) {
      if (emptyState) emptyState.classList.remove('oculto');
      return;
    }

    dados.forEach(user => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${user.codUsuario}</td>
        <td>${user.Nome || user.nome || ''}</td>
        <td>${user.Sobrenome || user.sobrenome || ''}</td>
        <td>${user.Idade || user.idade || ''} anos</td>
        <td>${user.Email || user.email || ''}</td>
        <td>${user.Telefone || user.telefone || '-'}</td>
        <td>${user.Cidade || user.cidade || '-'}/${user.Estado || user.estado || '-'}</td>
        <td class="texto-direita acoes-tabela">
          <button class="btn-editar-tabela" onclick="editarUsuario(${user.codUsuario})">
            <i class="fa-solid fa-pen"></i>
          </button>
          <button class="btn-excluir-tabela" onclick="excluirUsuario(${user.codUsuario})">
            <i class="fa-solid fa-trash"></i>
          </button>
        </td>
      `;
      tbody.appendChild(row);
    });
  } catch (err) {
    console.error('Erro ao listar usuários:', err);
    if (spinner) spinner.classList.add('oculto');
    if (emptyState) {
      emptyState.textContent = 'Erro ao carregar os dados.';
      emptyState.classList.remove('oculto');
    }
  }
}

// Editar usuário
async function editarUsuario(id) {
  try {
    const res = await fetch(`${API_URL}/usuarios/${id}`);
    if (!res.ok) throw new Error('Erro ao buscar usuário');
    const user = await res.json();

    if (hiddenId) hiddenId.value = user.codUsuario;
    if (inputNome) inputNome.value = user.Nome || user.nome || '';
    if (inputSobrenome) inputSobrenome.value = user.Sobrenome || user.sobrenome || '';
    if (inputIdade) inputIdade.value = user.Idade || user.idade || '';
    if (inputEmail) inputEmail.value = user.Email || user.email || '';
    if (inputTelefone) inputTelefone.value = user.Telefone || user.telefone || '';
    if (inputEndereco) inputEndereco.value = user.Endereco || user.endereco || '';
    if (inputCidade) inputCidade.value = user.Cidade || user.cidade || '';
    if (inputEstado) inputEstado.value = user.Estado || user.estado || '';

    if (typeof window.abrirFormCadastro === 'function') {
      window.abrirFormCadastro();
      const formTitle = document.getElementById('form-title');
      if (formTitle) formTitle.textContent = 'Editar Usuário';
    }
  } catch (err) {
    console.error('Erro ao buscar usuário:', err);
    if (typeof window.showToast === 'function') {
      window.showToast('Erro ao buscar dados do usuário.', true);
    }
  }
}

// Salvar / Atualizar usuário
if (userForm) {
  userForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = hiddenId.value;
    const usuario = {
      Nome: inputNome.value,
      Sobrenome: inputSobrenome.value,
      Idade: parseInt(inputIdade.value),
      Email: inputEmail.value,
      Telefone: inputTelefone.value,
      Endereco: inputEndereco.value,
      Cidade: inputCidade.value,
      Estado: inputEstado.value
    };

    const isEdit = !!id;
    const url = isEdit ? `${API_URL}/usuarios/${id}` : `${API_URL}/usuarios`;
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(usuario)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Erro ao salvar usuário.');

      if (typeof window.showToast === 'function') {
        window.showToast(data.message || 'Usuário salvo com sucesso!');
      }

      if (typeof window.fecharForm === 'function') {
        window.fecharForm();
      }

      listarUsuarios();
    } catch (err) {
      console.error('Erro ao salvar usuário:', err);
      if (typeof window.showToast === 'function') {
        window.showToast(err.message, true);
      }
    }
  });
}

// Excluir usuário
async function excluirUsuario(id) {
  if (!confirm('Deseja realmente excluir este usuário?')) return;

  try {
    const res = await fetch(`${API_URL}/usuarios/${id}`, {
      method: 'DELETE'
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Erro ao excluir usuário.');

    if (typeof window.showToast === 'function') {
      window.showToast(data.message || 'Usuário excluído com sucesso!');
    }
    listarUsuarios();
  } catch (err) {
    console.error('Erro ao excluir usuário:', err);
    if (typeof window.showToast === 'function') {
      window.showToast(err.message, true);
    }
  }
}

// Expor globalmente para os botões de ação na tabela
window.editarUsuario = editarUsuario;
window.excluirUsuario = excluirUsuario;

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  listarUsuarios();
});
