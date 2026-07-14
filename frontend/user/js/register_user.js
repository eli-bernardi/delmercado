// register_user.js — Cadastro e Edição (Submissão) de Usuários
(function() {
  const form        = document.getElementById('user-form');
  const hiddenId    = document.getElementById('user-id');
  const fNome       = document.getElementById('nome');
  const fSobrenome  = document.getElementById('sobrenome');
  const fIdade      = document.getElementById('idade');
  const fEmail      = document.getElementById('email');
  const fTelefone   = document.getElementById('telefone');
  const fEndereco   = document.getElementById('endereco');
  const fCidade     = document.getElementById('cidade');
  const fEstado     = document.getElementById('estado');

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
          ? await fetch(`${window.API || 'http://localhost:3000'}/usuarios/${id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
            })
          : await fetch(`${window.API || 'http://localhost:3000'}/usuarios`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
            });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Erro ao salvar usuário');

        if (window.showToast) {
          window.showToast(id ? 'Usuário atualizado com sucesso!' : 'Usuário cadastrado com sucesso!');
        } else {
          alert(id ? 'Usuário atualizado!' : 'Usuário cadastrado!');
        }

        if (window.fecharForm) window.fecharForm();
        if (window.listarUsuarios) window.listarUsuarios();
      } catch (err) {
        if (window.showToast) {
          window.showToast(err.message, true);
        } else {
          alert(err.message);
        }
      }
    });
  }
})();