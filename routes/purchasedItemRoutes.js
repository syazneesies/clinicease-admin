const express = require('express');
const router = express.Router();
const purchasedItemController = require('../controllers/purchasedItemsController');

router.get('/purchased_item', purchasedItemController.getPurchasedItem);
router.get('/purchased-items/:purchasedItemId', purchasedItemController.getPurchasedItemsById);
router.put('/update-transaction-status/:purchasedItemId', purchasedItemController.updateTransactionStatus);
module.exports = router;