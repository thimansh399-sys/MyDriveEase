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
        },
      });
    } else {
      // User signup
      const exists = await User.findOne({ phone });
      if (exists) return res.status(400).json({ message: 'Phone already registered as user' });

      const user = await User.create({ name, phone, password });
      const token = signToken(user._id, 'user');
      return res.status(201).json({
        token,
        user: {
          id: user._id,
          name: user.name,
          phone: user.phone,
          role: 'user',
        },
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Export router
module.exports = router;
