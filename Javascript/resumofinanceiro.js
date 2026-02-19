// Dados Iniciais Simulados
let transactions = [
    { id: 1, desc: "Salário Mensal", type: "receita", category: "Emprego", value: 3500.00, date: "2026-01-05" },
    { id: 2, desc: "Aluguel", type: "despesa", category: "Moradia", value: 1200.00, date: "2026-01-07" },
    { id: 3, desc: "Dividendos FIIs", type: "investimento", category: "B3", value: 120.50, date: "2026-01-15" },
    { id: 4, desc: "Supermercado", type: "despesa", category: "Alimentação", value: 650.00, date: "2026-01-10" },
    { id: 5, desc: "Tesouro Direto", type: "investimento", category: "Renda Fixa", value: 500.00, date: "2026-01-20" }
];

let myChart = null;

// Funções Auxiliares de Formatação
const formatCurrency = (value) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

const formatDate = (dateString) => {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
};

// Função Principal: Atualizar a Interface (Dashboard)
function updateDashboard(filterMonth = "2026-01") {
    const tbody = document.getElementById('transaction-list');
    tbody.innerHTML = '';

    let income = 0;
    let expense = 0;
    let invest = 0;

    // Filtra transações pelo mês selecionado (ou todas)
    const filteredData = filterMonth === 'all' 
        ? transactions 
        : transactions.filter(t => t.date.startsWith(filterMonth));

    filteredData.forEach(t => {
        // Somar totais
        if (t.type === 'receita') income += t.value;
        else if (t.type === 'despesa') expense += t.value;
        else if (t.type === 'investimento') invest += t.value;

        // Criar linha na tabela HTML
        const tr = document.createElement('tr');
        
        // Definição de classes de cor e badges
        let badgeClass = t.type === 'receita' ? 'badge-receita' : (t.type === 'despesa' ? 'badge-despesa' : 'badge-invest');
        let colorClass = t.type === 'receita' || t.type === 'investimento' ? 'text-green' : 'text-red';
        
        tr.innerHTML = `
            <td><strong>${t.desc}</strong></td>
            <td><span class="badge ${badgeClass}">${t.category}</span></td>
            <td style="text-transform: capitalize;">${t.type}</td>
            <td>${formatDate(t.date)}</td>
            <td class="${colorClass}"><strong>${formatCurrency(t.value)}</strong></td>
            <td><button class="action-btn" onclick="deleteItem(${t.id})"><i class="fas fa-trash"></i></button></td>
        `;
        tbody.appendChild(tr);
    });

    // Atualizar os Cards Superiores
    document.getElementById('total-income').innerText = formatCurrency(income);
    document.getElementById('total-expense').innerText = formatCurrency(expense);
    document.getElementById('total-invest').innerText = formatCurrency(invest);
    
    // Cálculo do Saldo (Receita - Despesa - Investimento)
    document.getElementById('total-balance').innerText = formatCurrency(income - expense - invest);

    // Atualizar o Gráfico
    updateChart(income, expense, invest);
}

// Configuração do Gráfico Chart.js
function updateChart(income, expense, invest) {
    const ctx = document.getElementById('financeChart').getContext('2d');
    
    // Destrói gráfico anterior para criar um novo sem sobreposição
    if (myChart) myChart.destroy();

    const saldoLivre = income - expense - invest;

    myChart = new Chart(ctx, {
        type: 'doughnut', // Tipo Rosca
        data: {
            labels: ['Despesas', 'Investimentos', 'Saldo Livre'],
            datasets: [{
                data: [expense, invest, saldoLivre > 0 ? saldoLivre : 0], // Evita saldo negativo no gráfico
                backgroundColor: [
                    '#dc2626', // Vermelho (Despesas)
                    '#4f86e9', // Azul (Investimentos)
                    '#16a34a'  // Verde (Saldo)
                ],
                borderWidth: 0,
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });
}

// --- Funções do Modal e Formulário ---

function openModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'flex';
    document.getElementById('date').valueAsDate = new Date(); // Padrão: data de hoje
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

function addTransaction(e) {
    e.preventDefault(); // Evita recarregar a página
    
    const desc = document.getElementById('desc').value;
    const type = document.getElementById('type').value;
    const category = document.getElementById('cat').value;
    const value = parseFloat(document.getElementById('amount').value);
    const date = document.getElementById('date').value;

    const newItem = {
        id: Date.now(), // Gera um ID único baseado no tempo
        desc, type, category, value, date
    };

    transactions.push(newItem);
    updateDashboard(); // Recalcula tudo
    closeModal();
    e.target.reset(); // Limpa o formulário
}

function deleteItem(id) {
    if(confirm('Deseja excluir este lançamento?')) {
        transactions = transactions.filter(t => t.id !== id);
        updateDashboard();
    }
}

function filterDate(value) {
    updateDashboard(value);
}

// Fechar modal ao clicar fora dele
window.onclick = function(event) {
    const modal = document.getElementById('modal');
    if (event.target == modal) {
        closeModal();
    }
}

// Inicializa o dashboard ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    updateDashboard();
});