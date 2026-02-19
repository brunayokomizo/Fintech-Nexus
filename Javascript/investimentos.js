// Dados iniciais simulados (como se viessem do Backend/OpenFinance)
let carteira = [
    { tipo: 'Ação', ticker: 'PETR4', qtd: 100, preco: 34.50, data: '2025-10-20' },
    { tipo: 'FII', ticker: 'HGLG11', qtd: 15, preco: 160.00, data: '2025-11-01' },
    { tipo: 'Renda Fixa', ticker: 'Tesouro Selic', qtd: 1, preco: 12500.00, data: '2025-05-15' }
];

// Função para formatar moeda (R$)
const formatarMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(valor);
};

// Função principal de renderização
function renderizarTabela() {
    const tbody = document.getElementById('tabela-investimentos');
    tbody.innerHTML = ''; // Limpa tabela

    let totalGeral = 0;
    let totalVariavel = 0;
    let totalFixa = 0;

    carteira.forEach((ativo, index) => {
        const totalPosicao = ativo.qtd * ativo.preco;
        totalGeral += totalPosicao;

        // Soma por categoria para os cards
        if (ativo.tipo === 'Renda Fixa') {
            totalFixa += totalPosicao;
        } else {
            totalVariavel += totalPosicao;
        }

        // Define a classe da badge baseada no tipo
        let badgeClass = 'bg-secondary';
        if (ativo.tipo === 'Ação') badgeClass = 'badge-acao';
        if (ativo.tipo === 'FII') badgeClass = 'badge-fii';
        if (ativo.tipo === 'Renda Fixa') badgeClass = 'badge-rf';

        const row = `
            <tr>
                <td class="ps-4">
                    <div class="d-flex align-items-center">
                        <div class="fw-bold">${ativo.ticker.toUpperCase()}</div>
                    </div>
                </td>
                <td><span class="badge ${badgeClass} border px-2 py-1 rounded-2">${ativo.tipo}</span></td>
                <td>${ativo.qtd}</td>
                <td>${formatarMoeda(ativo.preco)}</td>
                <td class="fw-bold text-dark">${formatarMoeda(totalPosicao)}</td>
                <td class="pe-4 text-end">
                    <button class="btn btn-sm btn-outline-danger border-0" onclick="removerAtivo(${index})">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });

    // Atualiza os Cards do Topo
    document.getElementById('total-patrimonio').innerText = formatarMoeda(totalGeral);
    document.getElementById('total-variavel').innerText = formatarMoeda(totalVariavel);
    document.getElementById('total-fixa').innerText = formatarMoeda(totalFixa);
}

// Adicionar novo investimento via Formulário
document.getElementById('formInvestimento').addEventListener('submit', function(e) {
    e.preventDefault(); // Impede o recarregamento da página

    const novoAtivo = {
        tipo: document.getElementById('tipoAtivo').value,
        ticker: document.getElementById('ticker').value.toUpperCase(),
        qtd: parseFloat(document.getElementById('quantidade').value),
        preco: parseFloat(document.getElementById('preco').value),
        data: new Date().toISOString().split('T')[0]
    };

    carteira.push(novoAtivo); // Adiciona ao array
    renderizarTabela(); // Atualiza a tela
    
    // Fecha o modal e limpa o form
    const modalElement = document.getElementById('modalNovoInvestimento');
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    modalInstance.hide();
    this.reset();
});

// Função para remover item (simples)
function removerAtivo(index) {
    if(confirm('Deseja remover este ativo da carteira?')) {
        carteira.splice(index, 1);
        renderizarTabela();
    }
}

// Inicializa a tabela ao carregar
renderizarTabela();