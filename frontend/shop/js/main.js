// main.js — Interface e Utilitários de Produtos
const API = 'http://localhost:3000';

// ─── ELEMENTOS DO LAYOUT ────────────────────────────────────────
const toast = document.getElementById('crud-toast');
const formSection = document.getElementById('form-container');
const formTitle = document.getElementById('form-title');
const form = document.getElementById('product-form');
const hiddenId = document.getElementById('product-id');
const btnShowForm = document.getElementById('btn-show-form');
const btnCancel = document.getElementById('btn-cancel');
const btnFormCancel = document.getElementById('btn-form-cancel');

// Menu mobile
const menuToggle = document.getElementById('menu-toggle');
const menu = document.getElementById('menu');

if (menuToggle && menu) {
  menuToggle.addEventListener('click', () => menu.classList.toggle('aberto'));
  menu.querySelectorAll('a').forEach(l => l.addEventListener('click', () => {
    if (window.innerWidth < 768) menu.classList.remove('aberto');
  }));
}

// ─── TOAST ──────────────────────────────────────────────────────
function showToast(msg, erro = false) {
  if (!toast) return;
  toast.textContent = msg;
  if (erro) {
    toast.className = 'toast erro';
  } else {
    toast.className = 'toast sucesso';
  }
  clearTimeout(toast._t);
  toast._t = setTimeout(() => {
    toast.className = 'toast oculto';
  }, 4500);
}

// ─── ABRIR / FECHAR FORMULÁRIO ──────────────────────────────────
function abrirFormCadastro() {
  if (!formSection) return;
  if (hiddenId) hiddenId.value = '';
  if (form) form.reset();
  if (formTitle) formTitle.textContent = 'Cadastrar Novo Produto';
  formSection.classList.remove('oculto');
  formSection.scrollIntoView({ behavior: 'smooth' });
}

function fecharForm() {
  if (!formSection) return;
  formSection.classList.add('oculto');
  if (form) form.reset();
  if (hiddenId) hiddenId.value = '';
}

if (btnShowForm) btnShowForm.addEventListener('click', abrirFormCadastro);
if (btnCancel) btnCancel.addEventListener('click', fecharForm);
if (btnFormCancel) btnFormCancel.addEventListener('click', fecharForm);

// Expor utilitários e constantes globalmente
window.API = API;
window.showToast = showToast;
window.abrirFormCadastro = abrirFormCadastro;
window.fecharForm = fecharForm;

// ─── REVEAL ANIMATION ───────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const elementos = document.querySelectorAll('.revelar');
  const observador = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('ativo');
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
  );
  elementos.forEach(el => observador.observe(el));
});