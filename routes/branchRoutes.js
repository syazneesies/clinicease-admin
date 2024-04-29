const express = require('express');
const branchController = require('../controllers/branchController');

const router = express.Router();

// Route to add a new transaction
router.post('/branches', branchController.addBranch);

// Route to fetch and display transactions
router.get('/branches', branchController.getBranches);

// Route to delete a service by ID
router.delete('/branches/:id', branchController.deleteBranchById);

module.exports = router;