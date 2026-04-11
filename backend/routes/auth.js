const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Driver = require('../models/Driver');
const { JWT_SECRET } = require('../config');
const { auth } = require('../middleware/auth');

const router = express.Router();

const signToken = (id, role) => {
  return jwt.sign({ id, role }, JWT_SECRET, { expiresIn: '7d' });
};

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { name, phone, password, role } = req.body;

    if (!name || !phone || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const selectedRole = role === 'driver' ? 'driver' : 'user';

    if (selectedRole === 'driver') {
      const exists = await Driver.findOne({ phone });
      if (exists) return res.status(400).json({ message: 'Phone already registered as driver' });

      const vehicle = req.body.vehicle || {};
      const driver = await Driver.create({
        name,
        phone,
        password,
        vehicle: {
          type: vehicle.type || 'sedan',
          model: vehicle.model || '',
          plate: vehicle.plate || '',
        },
      });

      const token = signToken(driver._id, 'driver');
      return res.status(201).json({
        token,
        user: {
          id: driver._id,
          name: driver.name,
          phone: driver.phone,
          role: 'driver',
          status: driver.status,
          vehicle: driver.vehicle,
          rating: driver.rating,
        },
      });
    }

    // User signup
    const exists = await User.findOne({ phone });
    if (exists) return res.status(400).json({ message: 'Phone already registered' });

    const user = await User.create({ name, phone, password, role: 'user' });
    const token = signToken(user._id, 'user');

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        role: 'user',
      },
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { phone, password, role } = req.body;

    if (!phone || !password) {
      return res.status(400).json({ message: 'Phone and password are required' });
    }

    const selectedRole = role === 'driver' ? 'driver' : 'user';

    if (selectedRole === 'driver') {
      const driver = await Driver.findOne({ phone }).select('+password');
      if (!driver) return res.status(400).json({ message: 'Invalid credentials' });

      const isMatch = await driver.comparePassword(password);
      if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

      const token = signToken(driver._id, 'driver');
      return res.json({
        token,
        user: {
          id: driver._id,
          name: driver.name,
          phone: driver.phone,
          role: 'driver',
          status: driver.status,
          vehicle: driver.vehicle,
          rating: driver.rating,
          earnings: driver.earnings,
          totalRides: driver.totalRides,
        },
      });
    }

    // User login
    const user = await User.findOne({ phone }).select('+password');
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = signToken(user._id, 'user');
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        role: 'user',
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/auth/me
router.get('/me', auth, async (req, res) => {
  try {
    if (req.user.role === 'driver') {
      const driver = await Driver.findById(req.user.id);
      if (!driver) return res.status(404).json({ message: 'Driver not found' });
      return res.json({
        id: driver._id,
        name: driver.name,
        phone: driver.phone,
        role: 'driver',
        status: driver.status,
        vehicle: driver.vehicle,
        rating: driver.rating,
        earnings: driver.earnings,
        totalRides: driver.totalRides,
        location: driver.location,
      });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({
      id: user._id,
      name: user.name,
      phone: user.phone,
      role: 'user',
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
