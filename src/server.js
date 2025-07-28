require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

const dbConnect = require('./config/db');
const authRoutes = require('./routes/auth');
const moneySourceRoutes = require('./routes/moneySource');
const expenseRoutes = require('./routes/expense');

dbConnect();

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/money-source', moneySourceRoutes);
app.use('/api/expense', expenseRoutes);

app.get('/', (req, res) => {
  res.send('Expense Tracker Backend Running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
