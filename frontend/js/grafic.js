const API_BASE = 'http://localhost:3000/compras/relatorios'
const resposta = document.getElementById('resposta')

function mostrarToast(msg, erro = false) {
    if (!resposta) return
    resposta.textContent = msg
    resposta.className = `toast ${erro ? 'erro' : 'sucesso'}`
    resposta.style.display = 'block'
    clearTimeout(resposta._timeout)
    resposta._timeout = setTimeout(() => {
        resposta.style.display = 'none'
    }, 4500)
}

async function carregarGraficos() {
    const spinner1 = document.getElementById('chart-spinner-1')
    const spinner2 = document.getElementById('chart-spinner-2')
    const empty1 = document.getElementById('chart-empty-1')
    const empty2 = document.getElementById('chart-empty-2')

    const canvas1 = document.getElementById('chart-estoque-critico')
    const canvas2 = document.getElementById('chart-volume-compras')
    if (!canvas1 || !canvas2) return
    const ctx1 = canvas1.getContext('2d')
    const ctx2 = canvas2.getContext('2d')

    try {
        if (spinner1) spinner1.classList.remove('oculto')
        if (spinner2) spinner2.classList.remove('oculto')
        if (empty1) empty1.classList.add('oculto')
        if (empty2) empty2.classList.add('oculto')

        const response = await fetch(`${API_BASE}/graficos`)
        if (!response.ok) throw new Error('Erro ao buscar dados para gráficos.')

        const data = await response.json()

        if (spinner1) spinner1.classList.add('oculto')
        if (spinner2) spinner2.classList.add('oculto')

        // Gráfico 1: Estoque Físico Crítico
        const produtosCriticos = data.estoqueCritico || []
        if (produtosCriticos.length === 0) {
            if (empty1) empty1.classList.remove('oculto')
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
                        legend: { labels: { color: '#ffffff' } }
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
            })
        }

        // Gráfico 2: Volume Financeiro de Compras
        const volumeCompras = data.volumeCompras || []
        if (volumeCompras.length === 0) {
            if (empty2) empty2.classList.remove('oculto')
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
                    indexAxis: 'y',
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { labels: { color: '#ffffff' } }
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
            })
        }
    } catch (err) {
        if (spinner1) spinner1.classList.add('oculto')
        if (spinner2) spinner2.classList.add('oculto')
        mostrarToast(err.message, true)
        console.error('Erro ao carregar gráficos:', err)
    }
}

document.addEventListener('DOMContentLoaded', carregarGraficos)
