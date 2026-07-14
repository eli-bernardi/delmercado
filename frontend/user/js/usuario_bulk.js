// usuario_bulk.js — Importação em Lote de Usuários
(function() {
  const btnBulk = document.getElementById('btn-bulk');

  if (btnBulk) {
    btnBulk.addEventListener('click', async () => {
      btnBulk.disabled = true;
      const textoOriginal = btnBulk.textContent;
      btnBulk.textContent = 'Carregando...';
      try {
        const res = await fetch(`${window.API || 'http://localhost:3000'}/usuarios/bulk`, {
          method: 'POST'
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        if (window.showToast) {
          window.showToast(data.message);
        } else {
          alert(data.message);
        }

        if (window.listarUsuarios) window.listarUsuarios();
      } catch (err) {
        if (window.showToast) {
          window.showToast(err.message, true);
        } else {
          alert(err.message);
        }
      } finally {
        btnBulk.disabled = false;
        btnBulk.textContent = textoOriginal;
      }
    });
  }
})();