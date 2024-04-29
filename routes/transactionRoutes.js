const express = require('express');
const transactionController = require('../controllers/transactionController');

const router = express.Router();

// Route to add a new transaction
router.post('/transactions', transactionController.addTransaction);

// Route to fetch and display transactions
router.get('/transactions', transactionController.getTransactions);

// Route to delete a service by ID
router.delete('/transactions/:id', transactionController.deleteTransactionById);

module.exports = router;