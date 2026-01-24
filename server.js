const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

//Allows frontend to talk to backend
app.use(cors());
app.use(bodyParser.json());


const MONGO_URI = 'mongodb+srv://anmol:0os1TAvPW6dHeLG0@cluster1.hva2eem.mongodb.net/?appName=Cluster1';

mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => console.log('❌ DB Connection Error:', err));

// 2. DATA MODEL
const expenseSchema = new mongoose.Schema({
    category: String,
    amount: Number,
    date: String,
    description: String
});

const Expense = mongoose.model('Expense', expenseSchema);
// 3. ROUTES (The API Endpoints)
// Fetch all expenses
// Add this to server.js
app.get('/', (req, res) => {
    res.send('Server is Running! 🚀');
});
app.get('/api/expenses', async (req, res) => {
    try {
        const expenses = await Expense.find();
        res.json(expenses);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST: Add a new expense
app.post('/api/expenses', async (req, res) => {
    const expense = new Expense({
        category: req.body.category,
        amount: req.body.amount,
        date: req.body.date,
        description: req.body.description
    });

    try {
        const newExpense = await expense.save();
        res.status(201).json(newExpense);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE: Remove an expense
app.delete('/api/expenses/:id', async (req, res) => {
    try {
        await Expense.findByIdAndDelete(req.params.id);
        res.json({ message: 'Expense deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 4. START SERVER
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});