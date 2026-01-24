// --- Data & State ---
let expenses = [
    
];

let barChartInstance = null;
let pieChartInstance = null;

// --- Elements ---
const form = document.getElementById('expense-form');
const listContainer = document.getElementById('transaction-list');
const totalEl = document.getElementById('total-expenses');
const monthEl = document.getElementById('monthly-expenses');
const avgEl = document.getElementById('avg-expenses');
const countEl = document.getElementById('total-count');

// --- Initialization ---
function init() {
    renderList();
    updateSummary();
    renderCharts();
    
    // Set default date to today
    document.getElementById('date').valueAsDate = new Date();
}

// --- List Rendering ---
function renderList() {
    listContainer.innerHTML = '';
    
    // Sort by newest first
    const sortedExpenses = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date));

    sortedExpenses.forEach(expense => {
        const item = document.createElement('div');
        item.className = 'transaction-item';
        item.innerHTML = `
            <div class="t-details">
                <h4>${expense.category}</h4>
                <p>${expense.description || 'No description'} • ${expense.date}</p>
            </div>
            <div style="display:flex; align-items:center;">
                <span class="t-amount">$${expense.amount.toFixed(2)}</span>
                <button class="delete-btn" onclick="deleteExpense(${expense.id})">×</button>
            </div>
        `;
        listContainer.appendChild(item);
    });
}

// --- Summary Calculations ---
function updateSummary() {
    const total = expenses.reduce((sum, item) => sum + item.amount, 0);
    const count = expenses.length;
    const avg = count > 0 ? total / count : 0;

    totalEl.textContent = `$${total.toFixed(2)}`;
    // For this demo, "This Month" is same as Total. 
    // In a real app, you'd filter by current month.
    monthEl.textContent = `$${total.toFixed(2)}`;
    avgEl.textContent = `$${avg.toFixed(2)}`;
    countEl.textContent = count;
}

// --- Add Expense ---
function addExpense(e) {
    e.preventDefault();
    
    const category = document.getElementById('category').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const date = document.getElementById('date').value;
    const description = document.getElementById('description').value;

    const newExpense = {
        id: Date.now(),
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
    document.getElementById('date').valueAsDate = new Date();
}

// --- Delete Expense ---
window.deleteExpense = function(id) {
    if(confirm('Delete this transaction?')) {
        expenses = expenses.filter(item => item.id !== id);
        renderList();
        updateSummary();
        renderCharts();
    }
}

// --- Charts Logic ---
function renderCharts() {
    const categories = ['Food', 'Transportation', 'Entertainment', 'Utilities', 'Shopping'];
    const dataValues = categories.map(cat => {
        return expenses
            .filter(e => e.category === cat)
            .reduce((sum, e) => sum + e.amount, 0);
    });

    // Destroy old charts to update
    if (barChartInstance) barChartInstance.destroy();
    if (pieChartInstance) pieChartInstance.destroy();

    const ctxBar = document.getElementById('barChart').getContext('2d');
    const ctxPie = document.getElementById('pieChart').getContext('2d');

    // 1. Bar Chart
    barChartInstance = new Chart(ctxBar, {
        type: 'bar',
        data: {
            labels: categories,
            datasets: [{
                label: 'Spending',
                data: dataValues,
                backgroundColor: '#3f3f3fc5',
                borderRadius: 6,
                barThickness: 30
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

    // 2. Pie Chart (Doughnut)
    pieChartInstance = new Chart(ctxPie, {
        type: 'doughnut',
        data: {
            labels: categories,
            datasets: [{
                data: dataValues,
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#2ee64d', '#9966FF'],
                borderWidth: 0,
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'right', labels: { boxWidth: 12, font: {size: 11} } }
            }
        }
    });
}

// --- Profile Dropdown Logic ---
window.toggleDropdown = function() {
    document.getElementById("myDropdown").classList.toggle("show");
}

// Close dropdown if clicking outside
window.onclick = function(event) {
    if (!event.target.matches('.user-profile')) {
        const dropdowns = document.getElementsByClassName("dropdown-menu");
        for (let i = 0; i < dropdowns.length; i++) {
            const openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}

// Event Listeners
form.addEventListener('submit', addExpense);

// Start
init();
