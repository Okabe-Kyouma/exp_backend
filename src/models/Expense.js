const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  expense: {
    type: String,
    required: true
  },
  moneySpent: {
    type: Number,
    required: true
  },
  source: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Expense', expenseSchema); 