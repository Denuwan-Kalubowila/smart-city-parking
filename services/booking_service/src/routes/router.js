const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking_controller');

router.post('/booking', bookingController.createBooking);
router.delete('/booking/:id', bookingController.cancelBooking);
router.get('/booking/user/:email', bookingController.getUserBookings);

module.exports = router;