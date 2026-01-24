// ---------------------------------------------------------
// 1. CONFIGURATION (The missing link!)
// ---------------------------------------------------------
// This tells your browser where the Server is living.
const API_URL = 'http://localhost:5000/api/expenses'; 

// Global variables
let expenses = []; 
let barChartInstance = null;
let pieChartInstance = null;

// DOM Elements
const form = document.getElementById('expense-form');
const listContainer = document.getElementById('transaction-list');
const totalEl = document.getElementById('total-expenses');
const monthEl = document.getElementById('monthly-expenses');
const avgEl = document.getElementById('avg-expenses');
const countEl = document.getElementById('total-count');

// ---------------------------------------------------------
// 2. INITIALIZATION
// ---------------------------------------------------------
async function init() {
    // 1. Load data from the Database (MongoDB)
    await fetchExpenses(); 
    
    // 2. Set the date input to today's date automatically
    document.getElementById('date').valueAsDate = new Date();
}

// ---------------------------------------------------------
// 3. API FUNCTIONS (Talking to the Server)
// ---------------------------------------------------------

// GET: Fetch all data from MongoDB
async function fetchExpenses() {
    try {
        const res = await fetch(API_URL);
        const data = await res.json();
        
        // Save the data to our global variable
        expenses = data; 
        
        // Update the screen
        renderList();
        updateSummary();
        renderCharts();
    } catch (error) {
        console.error('Error fetching data. Is the server running?', error);
        // Optional: Alert the user if server is down
        // alert("Could not connect to the server. Make sure 'node server.js' is running!");
    }
}

// POST: Add a new expense to MongoDB
async function addExpense(e) {
    e.preventDefault();
    
    // Create the data object from the form
    const newExpense = {
        category: document.getElementById('category').value,
        amount: parseFloat(document.getElementById('amount').value),
        date: document.getElementById('date').value,
        description: document.getElementById('description').value
    };

    try {
        // Send data to the server
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newExpense)
        });

        if (res.ok) {
            // If successful, reload everything so we see the new item
            await fetchExpenses(); 
            
            // Clear the form
            form.reset();
            document.getElementById('date').valueAsDate = new Date();
        } else {
            alert("Error saving data!");
        }
    } catch (error) {
        console.error('Error adding expense:', error);
    }
}

// DELETE: Remove an expense from MongoDB
window.deleteExpense = async function(id) {
    if(confirm('Delete this transaction?')) {
        try {
            // Send delete command to server
            await fetch(`${API_URL}/${id}`, {
                method: 'DELETE'
            });
            
            // Reload data to show it's gone
            await fetchExpenses(); 
        } catch (error) {
            console.error('Error deleting expense:', error);
        }
    }
}

// ---------------------------------------------------------
// 4. RENDERING (Updating the Screen)
// ---------------------------------------------------------

function renderList() {
    listContainer.innerHTML = '';
    
    // Sort items so newest are at the top
    const sortedExpenses = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date));

    sortedExpenses.forEach(expense => {
        const item = document.createElement('div');
        item.className = 'transaction-item';
        
        // Notice we use '_id' here because that's what MongoDB calls it
        item.innerHTML = `
            <div class="t-details">
                <h4>${expense.category}</h4>
                <p>${expense.description || 'No description'} • ${expense.date}</p>
            </div>
            <div style="display:flex; align-items:center;">
                <span class="t-amount">$${expense.amount.toFixed(2)}</span>
                <button class="delete-btn" onclick="deleteExpense('${expense._id}')">×</button>
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
    monthEl.textContent = `$${total.toFixed(2)}`;
    avgEl.textContent = `$${avg.toFixed(2)}`;
    countEl.textContent = count;
}

function renderCharts() {
    const categories = ['Food', 'Transportation', 'Entertainment', 'Utilities', 'Shopping'];
    const dataValues = categories.map(cat => {
        return expenses
            .filter(e => e.category === cat)
            .reduce((sum, e) => sum + e.amount, 0);
    });

    // Destroy old charts if they exist so they don't overlap
    if (barChartInstance) barChartInstance.destroy();
    if (pieChartInstance) pieChartInstance.destroy();

    const ctxBar = document.getElementById('barChart').getContext('2d');
    const ctxPie = document.getElementById('pieChart').getContext('2d');

    // Bar Chart
    barChartInstance = new Chart(ctxBar, {
        type: 'bar',
        data: {
            labels: categories,
            datasets: [{
                label: 'Spending',
                data: dataValues,
                backgroundColor: '#111',
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

    // Pie Chart
    pieChartInstance = new Chart(ctxPie, {
        type: 'doughnut',
        data: {
            labels: categories,
            datasets: [{
                data: dataValues,
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#1ef13a', '#9966FF'],
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

// ---------------------------------------------------------
// 5. EVENT LISTENERS
// ---------------------------------------------------------

// Profile Dropdown Logic
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

// Listen for form submit
form.addEventListener('submit', addExpense);

// Start the app
init();