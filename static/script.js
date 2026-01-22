// Initial Data
let expenses = [
    { id: 1, category: 'Food', amount: 5.99, date: '2026-01-15', description: 'Grocery shopping' },
    { id: 2, category: 'Transportation', amount: 69.00, date: '2026-01-14', description: 'Gas' },
    { id: 3, category: 'Entertainment', amount: 75.50, date: '2026-01-12', description: 'Movie tickets' }
];

// Chart Instances
let barChartInstance = null;
let pieChartInstance = null;

// DOM Elements
const form = document.getElementById('expense-form');
const listContainer = document.getElementById('transaction-list');
const totalEl = document.getElementById('total-expenses');
const monthEl = document.getElementById('monthly-expenses');
const avgEl = document.getElementById('avg-expenses');
const countEl = document.getElementById('total-count');

// --- Functions ---

function init() {
    renderList();
    updateSummary();
    renderCharts();
}

function renderList() {
    listContainer.innerHTML = '';
    
    // Sort by newest date first
    expenses.sort((a, b) => new Date(b.date) - new Date(a.date));

    expenses.forEach(expense => {
        const item = document.createElement('div');
        item.className = 'transaction-item';
        item.innerHTML = `
            <div class="t-details">
                <h4>${expense.category}</h4>
                <p>${expense.description} • ${expense.date}</p>
            </div>
            <div style="display:flex; align-items:center;">
                <span class="t-amount">$${expense.amount.toFixed(2)}</span>
                <button class="delete-btn" onclick="deleteExpense(${expense.id})">×</button>
            </div>
        `;
        listContainer.appendChild(item);
    });
}

function updateSummary() {
    const total = expenses.reduce((sum, item) => sum + item.amount, 0);
    const count = expenses.length;
    const avg = count > 0 ? total / count : 0;

    totalEl.textContent = `$${total.toFixed(2)}`;
    monthEl.textContent = `$${total.toFixed(2)}`; // Simplified for demo
    avgEl.textContent = `$${avg.toFixed(2)}`;
    countEl.textContent = count;
}

function addExpense(e) {
    e.preventDefault();
    
    const category = document.getElementById('category').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const date = document.getElementById('date').value;
    const description = document.getElementById('description').value;

    const newExpense = {
        id: Date.now(), // Simple unique ID
        category,
        amount,
        date,
        description
    };

    expenses.push(newExpense);
    
    renderList();
    updateSummary();
    renderCharts();
    
    form.reset();
    // Set date back to today
    document.getElementById('date').valueAsDate = new Date();
}

window.deleteExpense = function(id) {
    expenses = expenses.filter(item => item.id !== id);
    renderList();
    updateSummary();
    renderCharts();
}

function renderCharts() {
    // 1. Prepare Data
    const categories = ['Food', 'Transportation', 'Entertainment', 'Utilities', 'Shopping'];
    const dataValues = categories.map(cat => {
        return expenses
            .filter(e => e.category === cat)
            .reduce((sum, e) => sum + e.amount, 0);
    });

    // 2. Destroy old charts if they exist (to prevent overlay)
    if (barChartInstance) barChartInstance.destroy();
    if (pieChartInstance) pieChartInstance.destroy();

    const ctxBar = document.getElementById('barChart').getContext('2d');
    const ctxPie = document.getElementById('pieChart').getContext('2d');

    // 3. Create Bar Chart
    barChartInstance = new Chart(ctxBar, {
        type: 'bar',
        data: {
            labels: categories,
            datasets: [{
                label: 'Expenses',
                data: dataValues,
                backgroundColor: '#333',
                borderRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true, grid: { display: false } },
                x: { grid: { display: false } }
            }
        }
    });

    // 4. Create Pie Chart
    pieChartInstance = new Chart(ctxPie, {
        type: 'doughnut',
        data: {
            labels: categories,
            datasets: [{
                data: dataValues,
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'right' }
            }
        }
    });
}

// Event Listeners
form.addEventListener('submit', addExpense);

// Set default date to today
document.getElementById('date').valueAsDate = new Date();

// Run on load
init();