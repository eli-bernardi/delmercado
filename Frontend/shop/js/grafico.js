// grafico.js
const API_BASE = 'http://localhost:3000/compras/relatorios';
const toast = document.getElementById('graphics-toast');

// ============================================================
// TOAST
// ============================================================
function showToast(message, isError = false) {
    toast.textContent = message;
    toast.className = `mb-6 p-3 rounded-lg text-sm text-center font-semibold ${isError
            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
            : 'bg-green-500/20 text-green-400 border border-green-500/30'
        }`;
    toast.classList.remove('hidden');
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => toast.classList.add('hidden'), 4000);
}

// ============================================================
// CARREGAR DADOS E RENDERIZAR GRÁFICOS
// ============================================================
async function carregarGraficos() {
    // Spinners
    const spinner1 = document.getElementById('chart-spinner-1');
    const spinner2 = document.getElementById('chart-spinner-2');
    const empty1 = document.getElementById('chart-empty-1');
    const empty2 = document.getElementById('chart-empty-2');

    // Canvas
    const ctx1 = document.getElementById('chart-estoque-critico').getContext('2d');
    const ctx2 = document.getElementById('chart-volume-compras').getContext('2d');

    try {
        // Mostra spinners
        spinner1.classList.remove('hidden');
        spinner2.classList.remove('hidden');
        empty1.classList.add('hidden');
        empty2.classList.add('hidden');

        // Busca os dados
        const response = await fetch(`${API_BASE}/graficos`);
        if (!response.ok) throw new Error('Erro ao buscar dados para gráficos.');

        const data = await response.json();

        // Esconde spinners
        spinner1.classList.add('hidden');
        spinner2.classList.add('hidden');

        // ===== GRÁFICO 1: Estoque Físico Crítico (Barras Verticais) =====
        const produtosCriticos = data.estoqueCritico || [];
        if (produtosCriticos.length === 0) {
            empty1.classList.remove('hidden');
        } else {
            new Chart(ctx1, {
                type: 'bar',
                data: {
                    labels: produtosCriticos.map(p => p.nome),
                    datasets: [{
                        label: 'Quantidade em Estoque',
                        data: produtosCriticos.map(p => p.quantidade_atual),
                        backgroundColor: 'rgba(214, 40, 40, 0.7)',
                        borderColor: '#d62828',
                        borderWidth: 1,
                        borderRadius: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            labels: { color: '#ffffff' }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: { color: '#888888' },
                            grid: { color: 'rgba(255,255,255,0.05)' }
                        },
                        x: {
                            ticks: { color: '#888888' },
                            grid: { display: false }
                        }
                    }
                }
            });
        }

        // ===== GRÁFICO 2: Volume Financeiro de Compras (Barras Horizontais) =====
        const volumeCompras = data.volumeCompras || [];
        if (volumeCompras.length === 0) {
            empty2.classList.remove('hidden');
        } else {
            new Chart(ctx2, {
                type: 'bar',
                data: {
                    labels: volumeCompras.map(p => p.nome),
                    datasets: [{
                        label: 'Valor Financeiro (R$)',
                        data: volumeCompras.map(p => p.valor_financeiro_movimentado),
                        backgroundColor: 'rgba(214, 40, 40, 0.7)',
                        borderColor: '#d62828',
                        borderWidth: 1,
                        borderRadius: 4
                    }]
                },
                options: {
                    indexAxis: 'y', // Barras horizontais
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            labels: { color: '#ffffff' }
                        }
                    },
                    scales: {
                        x: {
                            beginAtZero: true,
                            ticks: { color: '#888888' },
                            grid: { color: 'rgba(255,255,255,0.05)' }
                        },
                        y: {
                            ticks: { color: '#888888' },
                            grid: { display: false }
                        }
                    }
                }
            });
        }

    } catch (err) {
        spinner1.classList.add('hidden');
        spinner2.classList.add('hidden');
        showToast(err.message, true);
        console.error('Erro ao carregar gráficos:', err);
    }
}

// ============================================================
// INICIALIZAR
// ============================================================
document.addEventListener('DOMContentLoaded', carregarGraficos);