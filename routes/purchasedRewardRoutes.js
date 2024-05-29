const express = require('express');
const router = express.Router();
const purchaseRewardController = require('../controllers/purchasedRewardController');

router.get('/purchased_reward', purchaseRewardController.getPurchasedReward);

router.post('/update_reward_status/:id', purchaseRewardController.updateStatus);
module.exports = router;