const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth");
const eventRoutes = require("./routes/events");
const bookingRoutes = require("./routes/bookings");
const path = require('path');

dotenv.config();
const app = express();

// Configure middleware with increased limits
// Must be before routes
app.use(cors());
app.use(express.json({
  limit: '50mb',
  extended: true,
  parameterLimit: 50000
}));
app.use(express.urlencoded({
  limit: '50mb',
  extended: true,
  parameterLimit: 50000
}));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/bookings", bookingRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  if (err.type === 'entity.too.large') {
    return res.status(413).json({
      msg: 'Request entity too large',
      error: 'The uploaded file is too large. Maximum size is 50MB'
    });
  }
  res.status(500).json({
    msg: 'Server error',
    error: err.message
  });
});

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected');
  app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
}).catch(err => console.error(err));