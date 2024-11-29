import { loadFromCSV } from './csvHandler.js';
import { formatCurrency, formatDate } from './formatters.js';

export function generateFinanceReport() {
    const transactions = loadFromCSV('transactions.csv') || [];
    
    // Calculate summary statistics
    const summary = transactions.reduce((acc, trans) => {
        const amount = Number(trans.amount);
        if (trans.type === 'income') {
            acc.totalIncome += amount;
        } else {
            acc.totalExpense += amount;
        }
        return acc;
    }, { totalIncome: 0, totalExpense: 0 });

    // Group transactions by category
    const categoryWise = transactions.reduce((acc, trans) => {
        if (!acc[trans.mode]) {
            acc[trans.mode] = { income: 0, expense: 0 };
        }
        if (trans.type === 'income') {
            acc[trans.mode].income += Number(trans.amount);
        } else {
            acc[trans.mode].expense += Number(trans.amount);
        }
        return acc;
    }, {});

    // Generate CSV content
    const csvContent = [
        'Student Finance Report',
        `Generated on: ${formatDate(new Date().toISOString())}`,
        '',
        'Summary',
        `Total Income,${formatCurrency(summary.totalIncome)}`,
        `Total Expense,${formatCurrency(summary.totalExpense)}`,
        `Net Balance,${formatCurrency(summary.totalIncome - summary.totalExpense)}`,
        '',
        'Category-wise Breakdown',
        'Mode,Income,Expense,Net',
        ...Object.entries(categoryWise).map(([mode, data]) => 
            `${mode},${formatCurrency(data.income)},${formatCurrency(data.expense)},${formatCurrency(data.income - data.expense)}`
        ),
        '',
        'Detailed Transactions',
        'Date,Description,Type,Mode,Amount',
        ...transactions.map(t => 
            `${formatDate(t.date)},${t.description},${t.type},${t.mode},${formatCurrency(t.amount)}`
        )
    ].join('\n');

    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `finance_report_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
}