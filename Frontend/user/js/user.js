const API_URL = 'http://localhost:3000/usuarios';

// ---------- Mobile menu toggle ----------
const menuToggle = document.getElementById('menu-toggle');
const menu = document.getElementById('menu');
if (menuToggle && menu) {
    menuToggle.addEventListener('click', () => {
        menu.classList.toggle('hidden');
    });
}

// ---------- DOM Elements ----------
const formContainer = document.getElementById('form-container');
const userForm = document.getElementById('user-form');
const formTitle = document.getElementById('form-title');
const btnShowForm = document.getElementById('btn-show-form');
const btnCancel = document.getElementById('btn-cancel');
const btnFormCancel = document.getElementById('btn-form-cancel');
const crudToast = document.getElementById('crud-toast');

const tableBody = document.getElementById('users-table-body');
const tableSpinner = document.getElementById('table-spinner');
const tableEmpty = document.getElementById('table-empty');

// Inputs
const inputId = document.getElementById('user-id');
const inputNome = document.getElementById('usr-nome');
const inputSobrenome = document.getElementById('usr-sobrenome');
const inputIdade = document.getElementById('usr-idade');
const inputEmail = document.getElementById('usr-email');
const inputTelefone = document.getElementById('usr-telefone');
const inputEndereco = document.getElementById('usr-endereco');
const inputCidade = document.getElementById('usr-cidade');
const inputEstado = document.getElementById('usr-estado');

// ---------- Toast ----------
function showToast(message, isError = false) {
    crudToast.textContent = message;
    crudToast.className = `mb-6 p-3 rounded-lg text-sm text-center font-semibold ${isError ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-green-500/20 text-green-400 border border-green-500/30'
        }`;
    crudToast.classList.remove('hidden');
    setTimeout(() => {
        crudToast.classList.add('hidden');
    }, 4000);
}

// ---------- Form handling ----------
function openForm(isEdit = false, data = null) {
    formContainer.classList.remove('hidden');
    if (isEdit && data) {
        formTitle.textContent = 'Editar Usuário';
        inputId.value = data.codUsuario;
        inputNome.value = data.Nome;
        inputSobrenome.value = data.Sobrenome;
        inputIdade.value = data.Idade;
        inputEmail.value = data['E-mail'];
        inputTelefone.value = data.Telefone || '';
        inputEndereco.value = data['Endereço'] || '';
        inputCidade.value = data.Cidade || '';
        inputEstado.value = data.Estado || '';
    } else {
        formTitle.textContent = 'Cadastrar Novo Usuário';
        userForm.reset();
        inputId.value = '';
    }
    formContainer.scrollIntoView({ behavior: 'smooth' });
}

function closeForm() {
    formContainer.classList.add('hidden');
    userForm.reset();
    inputId.value = '';
}

// ---------- Load users table ----------
async function loadUsers() {
    tableSpinner.classList.remove('hidden');
    tableEmpty.classList.add('hidden');
    tableBody.innerHTML = '';

    try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error('Erro ao buscar usuários');
        const users = await res.json();

        tableSpinner.classList.add('hidden');
        if (users.length === 0) {
            tableEmpty.classList.remove('hidden');
            return;
        }

        users.forEach(u => {
            const row = document.createElement('tr');
            row.className = 'hover:bg-white/5 transition-colors';

            const localStr = [u['Endereço'], u.Cidade, u.Estado].filter(Boolean).join(', ');

            row.innerHTML = `
                <td class="px-6 py-4 font-mono text-gray-400">${u.codUsuario}</td>
                <td class="px-6 py-4 font-semibold text-white">${u.Nome} ${u.Sobrenome}</td>
                <td class="px-6 py-4 text-gray-300">${u.Idade}</td>
                <td class="px-6 py-4 text-gray-300">${u['E-mail']}</td>
                <td class="px-6 py-4 text-gray-300">${u.Telefone || '-'}</td>
                <td class="px-6 py-4 text-gray-400 truncate max-w-xs" title="${localStr}">${localStr || '-'}</td>
                <td class="px-6 py-4 text-right flex justify-end gap-2 mt-1">
                    <button class="edit-btn bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30 px-2.5 py-1 rounded text-xs transition-colors" data-user='${JSON.stringify(u).replace(/'/g, "&apos;")}'>Editar</button>
                    <button class="delete-btn bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 px-2.5 py-1 rounded text-xs transition-colors" data-id="${u.codUsuario}">Excluir</button>
                </td>
            `;
            tableBody.appendChild(row);
        });

        // Add event listeners to buttons
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                const userData = JSON.parse(this.getAttribute('data-user'));
                editUser(userData);
            });
        });

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                const id = parseInt(this.getAttribute('data-id'));
                deleteUser(id);
            });
        });

    } catch (err) {
        tableSpinner.classList.add('hidden');
        tableEmpty.textContent = 'Erro ao carregar dados do servidor.';
        tableEmpty.classList.remove('hidden');
        showToast(err.message, true);
    }
}

// ---------- Form submit ----------
userForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = inputId.value;
    const payload = {
        Nome: inputNome.value,
        Sobrenome: inputSobrenome.value,
        Idade: parseInt(inputIdade.value, 10),
        'E-mail': inputEmail.value,
        Telefone: inputTelefone.value,
        'Endereço': inputEndereco.value,
        Cidade: inputCidade.value,
        Estado: inputEstado.value
    };

    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API_URL}/${id}` : API_URL;

    try {
        const res = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Erro ao salvar usuário');

        showToast(id ? 'Usuário atualizado com sucesso!' : 'Usuário cadastrado com sucesso!');
        closeForm();
        loadUsers();
    } catch (err) {
        showToast(err.message, true);
    }
});

// ---------- Edit & Delete ----------
function editUser(user) {
    openForm(true, user);
}

async function deleteUser(id) {
    if (!confirm('Deseja realmente remover este usuário?')) return;
    try {
        const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Erro ao remover usuário');
        showToast('Usuário excluído com sucesso!');
        loadUsers();
    } catch (err) {
        showToast(err.message, true);
    }
}

// ---------- Event listeners ----------
btnShowForm.addEventListener('click', () => openForm(false));
btnCancel.addEventListener('click', closeForm);
btnFormCancel.addEventListener('click', closeForm);

// ---------- Initial load ----------
loadUsers();