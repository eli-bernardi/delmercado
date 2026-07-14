// list_user.js — Listagem de Usuários
(function() {
  const tbody       = document.getElementById('users-table-body');
  const spinner     = document.getElementById('table-spinner');
  const emptyState  = document.getElementById('table-empty');

  async function listarUsuarios() {
    if (!tbody) return;
    tbody.innerHTML = '';
    if (spinner) spinner.classList.remove('oculto');
    if (emptyState) {
      emptyState.classList.add('oculto');
      emptyState.classList.remove('visivel');
    }

    try {
      const res = await fetch(`${window.API || 'http://localhost:3000'}/usuarios`);
      if (!res.ok) throw new Error('Falha ao carregar usuários');
      const dados = await res.json();

      if (spinner) spinner.classList.add('oculto');

      if (!dados.length) {
        if (emptyState) {
          emptyState.classList.remove('oculto');
          emptyState.classList.add('visivel');
        }
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
            <button onclick="editarUsuario(${u.codUsuario})" class="text-brand hover:text-white transition-colors text-sm mr-3" style="background: none; border: none; cursor: pointer;">Editar</button>
            <button onclick="excluirUsuario(${u.codUsuario})" class="text-red-400 hover:text-red-200 transition-colors text-sm" style="background: none; border: none; cursor: pointer;">Excluir</button>
          </td>
        `;
        tbody.appendChild(tr);
      });
    } catch (err) {
      if (spinner) spinner.classList.add('oculto');
      if (window.showToast) {
        window.showToast(err.message, true);
      } else {
        alert(err.message);
      }
    }
  }

  // Expor globalmente para atualização após ações
  window.listarUsuarios = listarUsuarios;

  document.addEventListener('DOMContentLoaded', listarUsuarios);
})();