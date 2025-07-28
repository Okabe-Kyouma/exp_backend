const Expense = require('../models/Expense');
const MoneySource = require('../models/MoneySource');
const User = require('../models/User');

exports.addExpense = async (req, res) => {
  try {
    const { expense, moneySpent, source } = req.body;
    if (!expense || typeof moneySpent !== 'number' || !source) {
      return res.status(400).json({ message: 'Expense, moneySpent, and source required' });
    }
    // Check if source is in user's sourcesEnum
    const user = await User.findById(req.user.userId);
    if (!user.sourcesEnum.includes(source)) {
      return res.status(400).json({ message: 'Source not allowed. Please select a valid source.' });
    }
    // Find the money source for this user
    const moneySource = await MoneySource.findOne({ user: req.user.userId, source });
    if (!moneySource) {
      return res.status(400).json({ message: 'Money source not found' });
    }
    if (moneySource.amount < moneySpent) {
      return res.status(400).json({ message: 'Insufficient funds in source' });
    }
    // Subtract the spent amount
    moneySource.amount -= moneySpent;
    await moneySource.save();
    // Create the expense
    const newExpense = new Expense({
      user: req.user.userId,
      expense,
      moneySpent,
      source
    });
    await newExpense.save();
    res.status(201).json(newExpense);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Expense.findOneAndDelete({ _id: id, user: req.user.userId });
    if (!deleted) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    res.json({ message: 'Expense deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.listExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.userId });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.expenseSummary = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.userId });
    const totalSpent = expenses.reduce((sum, exp) => sum + exp.moneySpent, 0);
    const bySource = {};
    expenses.forEach(exp => {
      bySource[exp.source] = (bySource[exp.source] || 0) + exp.moneySpent;
    });
    res.json({ totalSpent, bySource });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}; 