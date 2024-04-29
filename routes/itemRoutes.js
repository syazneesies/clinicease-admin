const express = require('express');
const itemController = require('../controllers/itemController');
const router = express.Router();
const upload = require('../middleware/multerMiddleware');

// Route to add a new service
router.post('/items', upload.single('itemImage'), itemController.addItem);

// Define route for handling file upload
router.post('/upload', upload.single('itemImage'), itemController.addItem);

// Route to fetch and display services
router.get('/items', itemController.getItems);

// Route to get service details by ID
router.get('/items/:id', itemController.getItemById);

// Route to delete a service by ID
router.delete('/items/:id', itemController.deleteItemById);

module.exports = router;
