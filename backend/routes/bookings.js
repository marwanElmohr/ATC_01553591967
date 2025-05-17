const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Event = require('../models/Event');
const Booking = require('../models/Booking');

router.post('/', protect, async (req, res) => {
  const { eventId } = req.body;

  // Validate inputs
  if (!eventId) {
    return res.status(400).json({ msg: 'Event ID is required' });
  }

  try {
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ msg: 'Event not found' });

    const booking = await Booking.create({
      userId: req.user.id,
      eventId
    });

    // Populate event details in response
    await booking.populate('eventId', 'name date venue price');

    res.status(200).json({
      msg: 'Booking created successfully',
      booking,
      summary: {
        eventName: event.name,
        pricePerTicket: event.price
      }
    });
  } catch (error) {
    console.error("Error during booking: ", error);
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
});

// Get user's bookings
router.get('/user', protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id })
      .populate('eventId', 'name date venue price');
    res.json(bookings);
  } catch (error) {
    console.error("Error fetching bookings: ", error);
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
});

module.exports = router;