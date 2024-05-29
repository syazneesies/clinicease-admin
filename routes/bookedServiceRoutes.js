const express = require('express');
const router = express.Router();
const bookedServicesController = require('../controllers/bookedserviceController');

router.get('/booked_service', bookedServicesController.getBookedServices);
router.post('/update_status/:id', bookedServicesController.updateStatus);
module.exports = router;