const API_URL = 'http://localhost:3000/compras/relatorios/graficos';
const toast = document.getElementById('graphics-toast');

// ---------- Mobile menu toggle ----------
const menuToggle = document.getElementById('menu-toggle');
const menu = document.getElementById('menu');
if (menuToggle && menu) {
    menuToggle.addEventListener('click', () => {
        menu.classList.toggle('hidden');
    });
}

// Spinners
const spinner1 = document.getElementById('chart-spinner-1');
const spinner2 = document.getElementById('chart-spinner-2');

// Empty state labels
const empty1 = document.getElementById('chart-empty-1');
const empty2 = document.getElementById('chart-empty-2');

// Chart instances
let chart1Instance = null;
let chart2Instance = null;

// Apply global Chart.js config overrides for dark theme
Chart.defaults.color = 'rgba(255, 255, 255, 0.7)';
Chart.defaults.borderColor = 'rgba(255, 255, 255, 0.08)';
Chart.defaults.font.family = "'Inter', sans-serif";

async function loadChartData() {
    try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error('Falha ao conectar com o backend.');
        const data = await res.json();

        // 1. Render Estoque Físico Crítico
        spinner1.classList.add('hidden');
        if (!data.estoqueCritico || data.estoqueCritico.length === 0) {
            empty1.classList.remove('hidden');
        } else {
            renderEstoqueCriticoChart(data.estoqueCritico);
        }

        // 2. Render Volume Financeiro de Compras
        spinner2.classList.add('hidden');
        if (!data.volumeCompras || data.volumeCompras.length === 0) {
            empty2.classList.remove('hidden');
        } else {
            renderVolumeComprasChart(data.volumeCompras);
        }

    } catch (err) {
        spinner1.classList.add('hidden');
        spinner2.classList.add('hidden');
        toast.textContent = `Erro ao carregar gráficos: ${err.message}`;
        toast.classList.remove('hidden');
    }
}

function renderEstoqueCriticoChart(list) {
    const ctx = document.getElementById('chart-estoque-critico').getContext('2d');
    const labels = list.map(item => item.title);
    const values = list.map(item => item.stock);

    chart1Instance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Itens em Estoque',
                data: values,
                backgroundColor: 'rgba(214, 40, 40, 0.7)',
                borderColor: 'rgba(214, 40, 40, 1)',
                borderWidth: 1.5,
                borderRadius: 6,
                hoverBackgroundColor: 'rgba(255, 107, 107, 0.9)'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(18, 18, 18, 0.95)',
                    borderColor: 'rgba(214, 40, 40, 0.3)',
                    borderWidth: 1,
                    titleColor: '#fff',
                    bodyColor: '#ddd',
                    padding: 10
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)'
                    },
                    ticks: {
                        precision: 0
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

function renderVolumeComprasChart(list) {
    const ctx = document.getElementById('chart-volume-compras').getContext('2d');
    const labels = list.map(item => item.nome);
    const values = list.map(item => parseFloat(item.valor_financeiro_movimentado));

    chart2Instance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Volume Financeiro (R$)',
                data: values,
                backgroundColor: 'rgba(255, 107, 107, 0.7)',
                borderColor: 'rgba(255, 107, 107, 1)',
                borderWidth: 1.5,
                borderRadius: 6,
                hoverBackgroundColor: 'rgba(214, 40, 40, 0.9)'
            }]
        },
        options: {
            indexAxis: 'y', // Horizontal bars
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(18, 18, 18, 0.95)',
                    borderColor: 'rgba(255, 107, 107, 0.3)',
                    borderWidth: 1,
                    titleColor: '#fff',
                    bodyColor: '#ddd',
                    padding: 10,
                    callbacks: {
                        label: function (context) {
                            return `R$ ${context.parsed.x.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)'
                    },
                    ticks: {
                        callback: function (value) {
                            return `R$ ${value}`;
                        }
                    }
                },
                y: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// Load graphics on render
loadChartData();