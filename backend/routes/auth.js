

const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const Driver = require('../models/Driver');
const { JWT_SECRET } = require('../config');
const { auth } = require('../middleware/auth');

const router = express.Router();



// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { phone, password, role } = req.body;
    if (!phone || !password) {
      return res.status(400).json({ message: 'Phone and password are required' });
    }


    let userDoc;
    let userRole;
    if (role === 'driver') {
      userDoc = await Driver.findOne({ phone }).select('+password');
      userRole = 'driver';
    } else {
      userDoc = await User.findOne({ phone }).select('+password');
      userRole = 'user';
    }

    if (!userDoc) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Compare password (bcryptjs)
    const bcrypt = require('bcryptjs');
    const isMatch = await bcrypt.compare(password, userDoc.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = signToken(userDoc._id, userRole);
    const profile = {
      id: userDoc._id,
      name: userDoc.name,
      phone: userDoc.phone,
      role: userRole,
    };
    if (userRole === 'driver') {
      profile.status = userDoc.status;
      profile.vehicle = userDoc.vehicle;
    }
    return res.json({ token, user: profile });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

const signToken = (id, role) => {
  return jwt.sign({ id, role }, JWT_SECRET, { expiresIn: '7d' });
};

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { phone, password, role } = req.body;
    if (!phone || !password) {
      return res.status(400).json({ message: 'Phone and password are required' });
    }

    let user;
    if (role === 'driver') {
      user = await Driver.findOne({ phone }).select('+password');
    } else {
      user = await User.findOne({ phone }).select('+password');
    }

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }


    // Password check using bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = signToken(user._id, role === 'driver' ? 'driver' : 'user');
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        role: role === 'driver' ? 'driver' : 'user',
        ...(role === 'driver' && { status: user.status }),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { name, phone, password, role } = req.body;

    console.log("Signup payload:", req.body);

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

      console.log("Driver created:", driver);

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

      console.log("User created:", user);

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
    console.error("Signup error:", err, err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Export router
module.exports = router;
