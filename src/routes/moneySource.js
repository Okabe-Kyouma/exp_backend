const express = require('express');
const router = express.Router();
const moneySourceController = require('../controllers/moneySourceController');
const auth = require('../middleware/auth');

router.post('/add', auth, moneySourceController.addMoneySource);
router.delete('/delete/:id', auth, moneySourceController.deleteMoneySource);
router.get('/total', auth, moneySourceController.getTotalAmount);
router.get('/list', auth, moneySourceController.listMoneySources);
router.put('/edit/:id', auth, moneySourceController.editMoneySource);

module.exports = router; 