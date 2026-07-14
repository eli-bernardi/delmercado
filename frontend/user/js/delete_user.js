// delete_user.js — Exclusão de Usuário
(function() {
  async function excluirUsuario(id) {
    if (!confirm(`Deseja excluir o usuário #${id}?`)) return;
    try {
      const res = await fetch(`${window.API || 'http://localhost:3000'}/usuarios/${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Erro ao excluir');

      if (window.showToast) {
        window.showToast('Usuário excluído com sucesso!');
      } else {
        alert('Usuário excluído!');
      }

      if (window.listarUsuarios) window.listarUsuarios();
    } catch (err) {
      if (window.showToast) {
        window.showToast(err.message, true);
      } else {
        alert(err.message);
      }
    }
  }

  // Expor globalmente para ser chamado pelas linhas da tabela
  window.excluirUsuario = excluirUsuario;
})();