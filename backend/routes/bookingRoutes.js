const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

// 1. Create booking (called from buyer form)
router.post('/', bookingController.createBooking);

// 2. Get bookings for logged-in expert
router.get('/expert/bookings',  bookingController.getExpertBookings);

// 3. Accept a booking by ID
router.post('/:id/accept', bookingController.acceptBooking);

module.exports = router;
