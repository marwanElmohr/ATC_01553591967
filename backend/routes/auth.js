const express = require('express');
const bcrypt = require("bcryptjs");
const router = express.Router();
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require("../models/User");
const { protect } = require('../middleware/auth');

const registerValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 })
];

const loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
];

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error getting current user:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.post("/register", registerValidation, async (req, res) => {
  try { 
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log('Error during validation:', errors.array());
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, password } = req.body;
      console.log('Registering ', email);

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ msg: 'Email already exists' });
      }

      const hashed = await bcrypt.hash(password, 10);

      const user = await User.create({ name, email, password: hashed, role: 'user' });
      console.log("User registered successfully");

      // Create token
      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      // Return user data without password and include token
      const userData = {
        email: user.email,
        name: user.name,
        role: user.role
      };

      res.status(200).json({
        token,
        user: userData
      });
  }
  catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message
    });
  }
});

router.post("/login", loginValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Error during validation:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Incorrect password" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return user data without password
    const userData = {
      email: user.email,
      name: user.name,
      role: user.role
    };

    res.json({
      token,
      user: userData
    });
  }
  catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message
    });
  }
});

router.get("/allusers", protect, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  const users = await User.find({}).select('-password');
  res.json(users);
});

router.put("/users/:id/role", protect, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  const { id } = req.params;
  const { role } = req.body;
  const user = await User.findByIdAndUpdate(id, { role }, { new: true });
  res.json(user);
});
module.exports = router;