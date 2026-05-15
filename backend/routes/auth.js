const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const Driver = require('../models/Driver');

const { JWT_SECRET } = require('../config');
const { auth } = require('../middleware/auth');

const router = express.Router();

const signToken = (id, role) => {
  return jwt.sign({ id, role }, JWT_SECRET, {
    expiresIn: '7d',
  });
};



// ================= LOGIN =================
router.post('/login', async (req, res) => {
  try {

    const { phone, password, role } = req.body;

    if (!phone || !password) {
      return res.status(400).json({
        message: 'Phone and password required',
      });
    }

    let user;

    if (role === 'driver') {
      user = await Driver.findOne({ phone }).select('+password');
    } else {
      user = await User.findOne({
        phone,
        ...(role === 'admin' ? { role: 'admin' } : {}),
      }).select('+password');
    }

    if (!user) {
      return res.status(400).json({
        message: 'User not found',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: 'Invalid credentials',
      });
    }

    const token = signToken(
      user._id,
      role === 'driver'
        ? 'driver'
        : role === 'admin'
        ? 'admin'
        : 'user'
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role:
          role === 'driver'
            ? 'driver'
            : role === 'admin'
            ? 'admin'
            : 'user',
      },
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Server error',
    });
  }
});



router.post('/signup', async (req, res) => {

  try {

    const {
      name,
      phone,
      password,
      role,
      aadhaarNumber,
      licenseNumber,
    } = req.body;

    // USER SIGNUP
    if (role === 'user') {

      const existingUser = await User.findOne({ phone });

      if (existingUser) {

        return res.status(400).json({
          message: 'User already exists',
        });

      }

      const user = await User.create({
        name,
        phone,
        password,
      });

      return res.status(201).json({
        success: true,
        user,
      });

    }

    // DRIVER SIGNUP
    if (role === 'driver') {

      const existingDriver =
        await Driver.findOne({ phone });

      if (existingDriver) {

        return res.status(400).json({
          message: 'Driver already exists',
        });

      }

      const driver = await Driver.create({

        name,
        phone,
        password,

        aadhaarNumber,
        licenseNumber,

        role: 'driver',

      });

      return res.status(201).json({

        success: true,

        driver,

      });

    }

    return res.status(400).json({
      message: 'Invalid role',
    });

  } catch (err) {

    console.log(
      'SIGNUP ERROR =>',
      err
    );

    res.status(500).json({
      message: 'Server error',
    });

  }
});


// ================= UPDATE PROFILE =================
router.put('/update-profile/:id', async (req, res) => {

  try {

    const { name, email, phone } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        name,
        email,
        phone,
      },
      {
        new: true,
      }
    );

    res.json({
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: 'Server Error',
    });
  }

});

module.exports = router;
