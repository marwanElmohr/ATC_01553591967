const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    set: v => v.replace(/^\s+/, '')
  },
  description: {
    type: String,
    required: true,
    set: v => v.replace(/^\s+/, '')
  },
  category: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  venue: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  image: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Event', eventSchema);