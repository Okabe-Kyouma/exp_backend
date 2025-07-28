const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');
const auth = require('../middleware/auth');

router.post('/add', auth, expenseController.addExpense);
router.delete('/delete/:id', auth, expenseController.deleteExpense);
router.get('/list', auth, expenseController.listExpenses);
router.get('/summary', auth, expenseController.expenseSummary);

module.exports = router; 