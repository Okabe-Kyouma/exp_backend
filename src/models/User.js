const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    unique: true,
    match: /^\d{10}$/
  },
  pin: {
    type: String,
    required: true,
  },
  sourcesEnum: {
    type: [String], 
    default: []
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema); 