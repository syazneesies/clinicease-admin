const express = require('express');
const serviceController = require('../controllers/serviceController');
const router = express.Router();
const upload = require('../middleware/multerMiddleware');

// Route to add a new service
router.post('/addService', upload.single('serviceImage'), serviceController.addService);

// Define route for handling file upload
router.post('/upload', upload.single('serviceImage'), serviceController.addService);

// Route to fetch and display services
router.get('/services', serviceController.getServices);

// Route to get service details by ID
router.get('/services/:id', serviceController.getServiceById);

// Route to delete a service by ID
router.delete('/services/:id', serviceController.deleteServiceById);

module.exports = router;
