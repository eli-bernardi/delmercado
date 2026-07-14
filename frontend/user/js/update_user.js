// update_user.js — Carregamento de dados para Edição de Usuário
(function() {
  const hiddenId    = document.getElementById('user-id');
  const fNome       = document.getElementById('nome');
  const fSobrenome  = document.getElementById('sobrenome');
  const fIdade      = document.getElementById('idade');
  const fEmail      = document.getElementById('email');
  const fTelefone   = document.getElementById('telefone');
  const fEndereco   = document.getElementById('endereco');
  const fCidade     = document.getElementById('cidade');
  const fEstado     = document.getElementById('estado');
  const formTitle   = document.getElementById('form-title');
  const formSection = document.getElementById('form-container');

  async function editarUsuario(id) {
    try {
      const res = await fetch(`${window.API || 'http://localhost:3000'}/usuarios/${id}`);
      if (!res.ok) throw new Error('Usuário não encontrado');
      const u = await res.json();

      if (hiddenId) hiddenId.value   = u.codUsuario;
      if (fNome) fNome.value      = u.nome      || '';
      if (fSobrenome) fSobrenome.value = u.sobrenome || '';
      if (fIdade) fIdade.value     = u.idade     || '';
      if (fEmail) fEmail.value     = u.email     || '';
      if (fTelefone) fTelefone.value  = u.telefone  || '';
      if (fEndereco) fEndereco.value  = u.endereco  || '';
      if (fCidade) fCidade.value    = u.cidade    || '';
      if (fEstado) fEstado.value    = u.estado    || '';

      if (formTitle) formTitle.textContent = `Editar Usuário #${id}`;
      if (formSection) {
        formSection.classList.remove('oculto');
        formSection.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (err) {
      if (window.showToast) {
        window.showToast(err.message, true);
      } else {
        alert(err.message);
      }
    }
  }

  // Expor globalmente para ser chamado pelas linhas da tabela
  window.editarUsuario = editarUsuario;
})();