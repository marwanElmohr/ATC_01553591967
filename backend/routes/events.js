const express = require("express");
const Event = require("../models/Event");
const router = express.Router();
const { protect, admin } = require('../middleware/auth');

router.get("/", async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  }
  catch (error) {
    console.error('Get all events error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.post("/", protect, admin, async (req, res) => {
  try {
    console.log('Creating event with data:', {
      body: {
        ...req.body,
        image: req.body.image ? 'base64_image_data' : undefined
      }
    });

    // Validate required fields
    const requiredFields = ['name', 'description', 'date', 'price', 'category', 'venue', 'image'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      console.log('Missing fields:', missingFields);
      return res.status(400).json({ 
        msg: `Missing required fields: ${missingFields.join(', ')}`,
        missingFields
      });
    }

    // Validate base64 image
    if (!req.body.image.startsWith('data:image/')) {
      console.log('Invalid image format:', req.body.image.substring(0, 50) + '...');
      return res.status(400).json({ msg: 'Invalid image format. Must be base64 encoded image.' });
    }

    // Convert price to number
    const price = Number(req.body.price);
    if (isNaN(price)) {
      console.log('Invalid price:', req.body.price);
      return res.status(400).json({ msg: 'Price must be a valid number' });
    }

    // Create event data object
    const eventData = {
      name: req.body.name,
      description: req.body.description,
      date: new Date(req.body.date),
      price: price,
      category: req.body.category,
      venue: req.body.venue,
      image: req.body.image
    };

    console.log('Processed event data:', {
      ...eventData,
      image: 'base64_image_data' // Log placeholder instead of actual base64 data
    });

    const event = await Event.create(eventData);
    console.log('Event created successfully:', {
      ...event.toObject(),
      image: 'base64_image_data' // Log placeholder instead of actual base64 data
    });
    res.json(event);
  }
  catch (error) {
    console.error('Create event error:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      code: error.code,
      body: {
        ...req.body,
        image: req.body.image ? 'base64_image_data' : undefined
      }
    });

    // Send more detailed error information in development
    res.status(500).json({ 
      msg: 'Server error', 
      error: {
        message: error.message,
        name: error.name,
        code: error.code
      }
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
});

router.put("/:id", protect, admin, async (req, res) => {
  try {
    // Get the existing event first
    const existingEvent = await Event.findById(req.params.id);
    if (!existingEvent) {
      return res.status(404).json({ msg: 'Event not found' });
    }

    // Prepare update data
    const updateData = { ...req.body };
    
    // Validate base64 image if provided
    if (updateData.image && !updateData.image.startsWith('data:image/')) {
      return res.status(400).json({ msg: 'Invalid image format. Must be base64 encoded image.' });
    }

    // Convert price to number if provided
    if (updateData.price) {
      updateData.price = Number(updateData.price);
      if (isNaN(updateData.price)) {
        return res.status(400).json({ msg: 'Price must be a valid number' });
      }
    }

    // Convert date if provided
    if (updateData.date) {
      updateData.date = new Date(updateData.date);
    }

    // Update the event
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    console.log('Event updated successfully:', {
      ...event.toObject(),
      image: 'base64_image_data' // Log placeholder instead of actual base64 data
    });

    res.json(event);
  }
  catch (error) {
    console.error('Update event error:', {
      message: error.message,
      stack: error.stack,
      body: {
        ...req.body,
        image: req.body.image ? 'base64_image_data' : undefined
      }
    });

    res.status(500).json({ 
      msg: 'Server error', 
      error: error.message 
    });
  }
});

router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }

    await Event.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Event removed successfully.' });
  }
  catch (error) {
    console.error('Delete event error:', {
      message: error.message,
      stack: error.stack
    });
    res.status(500).json({ 
      msg: 'Server error', 
      error: error.message 
    });
  }
});

module.exports = router;