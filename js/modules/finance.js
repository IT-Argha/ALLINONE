import { saveToCSV, loadFromCSV } from '../utils/csvHandler.js';
import { formatCurrency } from '../utils/formatters.js';
import { generateFinanceReport } from '../utils/reportGenerator.js';

export function initializeFinance() {
    const transactionForm = document.getElementById('transactionForm');
    const transactionsList = document.getElementById('transactionsList');
    const totalBalanceElement = document.getElementById('totalBalance');
    
    let transactions = loadFromCSV('transactions.csv') || [];
    updateTransactionsList();
    updateBalance();

    // Add download report button
    const reportSection = document.createElement('div');
    reportSection.className = 'report-section';
    reportSection.innerHTML = `
        <button id="downloadReport" class="download-report-btn">
            📊 Download Finance Report
        </button>
    `;
    document.querySelector('#finance').insertBefore(
        reportSection, 
        document.querySelector('.transactions-list')
    );

    document.getElementById('downloadReport').addEventListener('click', generateFinanceReport);

    transactionForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const transaction = {
            id: Date.now(),
            description: document.getElementById('transDescription').value,
            amount: Number(document.getElementById('transAmount').value),
            type: document.getElementById('transType').value,
            mode: document.getElementById('transMode').value,
            date: new Date().toISOString()
        };

        transactions.push(transaction);
        saveToCSV('transactions.csv', transactions);
        
        updateTransactionsList();
        updateBalance();
        transactionForm.reset();
    });

    function updateTransactionsList() {
        transactionsList.innerHTML = '';
        const summary = document.createElement('div');
        summary.className = 'transaction-summary';
        
        const totalIncome = transactions.reduce((sum, t) => 
            sum + (t.type === 'income' ? Number(t.amount) : 0), 0);
        const totalExpense = transactions.reduce((sum, t) => 
            sum + (t.type === 'expense' ? Number(t.amount) : 0), 0);
            
        summary.innerHTML = `
            <div class="summary-item income">
                <span>Total Income</span>
                <span>${formatCurrency(totalIncome)}</span>
            </div>
            <div class="summary-item expense">
                <span>Total Expense</span>
                <span>${formatCurrency(totalExpense)}</span>
            </div>
        `;
        
        transactionsList.appendChild(summary);
        
        const transactionsContainer = document.createElement('div');
        transactionsContainer.className = 'transactions-container';
        
        transactions.slice().reverse().forEach(transaction => {
            const item = document.createElement('div');
            item.className = 'transaction-item';
            item.innerHTML = `
                <div class="transaction-info">
                    <strong>${transaction.description}</strong>
                    <div class="transaction-meta">
                        <span>${new Date(transaction.date).toLocaleDateString()}</span>
                        <span class="transaction-mode">${transaction.mode}</span>
                    </div>
                </div>
                <span class="${transaction.type === 'income' ? 'success' : 'danger'}">
                    ${transaction.type === 'income' ? '+' : '-'}${formatCurrency(transaction.amount)}
                </span>
            `;
            transactionsContainer.appendChild(item);
        });
        
        transactionsList.appendChild(transactionsContainer);
    }

    function updateBalance() {
        const balance = transactions.reduce((total, transaction) => {
            const amount = Number(transaction.amount) || 0;
            return total + (transaction.type === 'income' ? amount : -amount);
        }, 0);
        
        totalBalanceElement.textContent = formatCurrency(balance);
    }
}