// main.js — Usuários CRUD
const API = 'http://localhost:3000';

// ─── ELEMENTOS ─────────────────────────────────────────────────
const tbody       = document.getElementById('users-table-body');
const spinner     = document.getElementById('table-spinner');
const emptyState  = document.getElementById('table-empty');
const toast       = document.getElementById('crud-toast');
const formSection = document.getElementById('form-container');
const formTitle   = document.getElementById('form-title');
const form        = document.getElementById('user-form');
const hiddenId    = document.getElementById('user-id');
const btnShowForm = document.getElementById('btn-show-form');
const btnCancel   = document.getElementById('btn-cancel');
const btnFormCancel = document.getElementById('btn-form-cancel');

// Campos do formulário
const fNome      = document.getElementById('nome');
const fSobrenome = document.getElementById('sobrenome');
const fIdade     = document.getElementById('idade');
const fEmail     = document.getElementById('email');
const fTelefone  = document.getElementById('telefone');
const fEndereco  = document.getElementById('endereco');
const fCidade    = document.getElementById('cidade');
const fEstado    = document.getElementById('estado');

// Menu mobile (se existir botão de toggle)
const menuToggle = document.getElementById('menu-toggle');
const menu       = document.getElementById('menu');
if (menuToggle && menu) {
  menuToggle.addEventListener('click', () => menu.classList.toggle('hidden'));
  menu.querySelectorAll('a').forEach(l => l.addEventListener('click', () => {
    if (window.innerWidth < 768) menu.classList.add('hidden');
  }));
}

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
  toast._t = setTimeout(() => toast.classList.add('hidden'), 4500);
}

// ─── LISTAR ─────────────────────────────────────────────────────
async function listarUsuarios() {
  if (!tbody) return;
  tbody.innerHTML = '';
  if (spinner) spinner.classList.remove('hidden');
  if (emptyState) emptyState.classList.add('hidden');

  try {
    const res = await fetch(`${API}/usuarios`);
    if (!res.ok) throw new Error('Falha ao carregar usuários');
    const dados = await res.json();

    if (spinner) spinner.classList.add('hidden');

    if (!dados.length) {
      if (emptyState) emptyState.classList.remove('hidden');
      return;
    }

    dados.forEach(u => {
      const tr = document.createElement('tr');
      tr.className = 'hover:bg-white/5 transition-colors border-b border-white/5';
      tr.innerHTML = `
        <td class="px-6 py-4 font-mono text-gray-400">${u.codUsuario}</td>
        <td class="px-6 py-4 font-semibold text-white">${u.nome || '-'}</td>
        <td class="px-6 py-4 text-gray-300">${u.sobrenome || '-'}</td>
        <td class="px-6 py-4 text-gray-300">${u.idade || '-'}</td>
        <td class="px-6 py-4 text-gray-300">${u.email || '-'}</td>
        <td class="px-6 py-4 text-gray-300">${u.telefone || '-'}</td>
        <td class="px-6 py-4 text-gray-300">${u.cidade || '-'}/${u.estado || '-'}</td>
        <td class="px-6 py-4 text-right">
          <button onclick="editarUsuario(${u.codUsuario})" class="text-brand hover:text-white transition-colors text-sm mr-3">Editar</button>
          <button onclick="excluirUsuario(${u.codUsuario})" class="text-red-400 hover:text-red-200 transition-colors text-sm">Excluir</button>
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
  if (formTitle) formTitle.textContent = 'Cadastrar Novo Usuário';
  formSection.classList.remove('hidden');
  formSection.scrollIntoView({ behavior: 'smooth' });
}

function fecharForm() {
  if (!formSection) return;
  formSection.classList.add('hidden');
  form.reset();
  hiddenId.value = '';
}

if (btnShowForm)   btnShowForm.addEventListener('click', abrirFormCadastro);
if (btnCancel)     btnCancel.addEventListener('click', fecharForm);
if (btnFormCancel) btnFormCancel.addEventListener('click', fecharForm);

// ─── CADASTRAR / ATUALIZAR ──────────────────────────────────────
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = hiddenId.value;
    const payload = {
      nome:      fNome.value,
      sobrenome: fSobrenome.value,
      idade:     parseInt(fIdade.value) || 0,
      email:     fEmail.value,
      telefone:  fTelefone.value,
      endereco:  fEndereco.value,
      cidade:    fCidade.value,
      estado:    fEstado.value
    };

    try {
      const res = id
        ? await fetch(`${API}/usuarios/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
        : await fetch(`${API}/usuarios`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Erro ao salvar usuário');

      showToast(id ? 'Usuário atualizado com sucesso!' : 'Usuário cadastrado com sucesso!');
      fecharForm();
      listarUsuarios();
    } catch (err) {
      showToast(err.message, true);
    }
  });
}

// ─── EDITAR ─────────────────────────────────────────────────────
async function editarUsuario(id) {
  try {
    const res = await fetch(`${API}/usuarios/${id}`);
    if (!res.ok) throw new Error('Usuário não encontrado');
    const u = await res.json();

    hiddenId.value   = u.codUsuario;
    fNome.value      = u.nome      || '';
    fSobrenome.value = u.sobrenome || '';
    fIdade.value     = u.idade     || '';
    fEmail.value     = u.email     || '';
    fTelefone.value  = u.telefone  || '';
    fEndereco.value  = u.endereco  || '';
    fCidade.value    = u.cidade    || '';
    fEstado.value    = u.estado    || '';

    if (formTitle) formTitle.textContent = `Editar Usuário #${id}`;
    formSection.classList.remove('hidden');
    formSection.scrollIntoView({ behavior: 'smooth' });
  } catch (err) {
    showToast(err.message, true);
  }
}

// ─── EXCLUIR ─────────────────────────────────────────────────────
async function excluirUsuario(id) {
  if (!confirm(`Deseja excluir o usuário #${id}?`)) return;
  try {
    const res = await fetch(`${API}/usuarios/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Erro ao excluir');
    showToast('Usuário excluído com sucesso!');
    listarUsuarios();
  } catch (err) {
    showToast(err.message, true);
  }
}

// ─── CARGA EM LOTE ──────────────────────────────────────────────
const btnBulk = document.getElementById('btn-bulk');
if (btnBulk) {
  btnBulk.addEventListener('click', async () => {
    btnBulk.disabled = true;
    btnBulk.textContent = 'Carregando...';
    try {
      const res = await fetch(`${API}/usuarios/bulk`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      showToast(data.message);
      listarUsuarios();
    } catch (err) {
      showToast(err.message, true);
    } finally {
      btnBulk.disabled = false;
      btnBulk.textContent = 'Importar Usuários (DummyJSON)';
    }
  });
}

// ─── INICIALIZAÇÃO ───────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', listarUsuarios);