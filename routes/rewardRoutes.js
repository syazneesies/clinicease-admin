const express = require('express');
const rewardController = require('../controllers/rewardController');
const upload = require('../middleware/multerMiddleware');

const router = express.Router();

// Route to add a new service
router.post('/rewards', upload.single('rewardImage'), rewardController.addReward);

// Define route for handling file upload
router.post('/upload', upload.single('rewardImage'), rewardController.addReward);

// Route to fetch and display services
router.get('/rewards', rewardController.getRewards);

// Route to get service details by ID
router.get('/rewards/:id', rewardController.getRewardById);

// Route to delete a service by ID
router.delete('/rewards/:id', rewardController.deleteRewardById);


module.exports = router;
