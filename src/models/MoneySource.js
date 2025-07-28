const mongoose = require('mongoose');

const moneySourceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  source: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('MoneySource', moneySourceSchema); 