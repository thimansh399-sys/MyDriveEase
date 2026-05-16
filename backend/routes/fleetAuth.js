const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Fleet = require('../models/Fleet');
const { JWT_SECRET } = require('../config');

const router = express.Router();

const serializeFleet = (fleet) => {
  const data = fleet.toObject();
  delete data.password;
  return data;
};

// ===============================
// REGISTER
// ===============================
const registerFleet = async (req, res) => {
  try {

    console.log(req.body);
    const {
      companyName,
      ownerName,
      email,
      phone,
      password,
      city,
      address,
    } = req.body;

    if (!companyName || !ownerName || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: 'Company name, owner name, email, phone and password are required',
      });
    }

    // CHECK EXISTING
    const existingFleet = await Fleet.findOne({
      $or: [{ email: email.toLowerCase().trim() }, { phone: phone.trim() }],
    });

    if (existingFleet) {
      return res.status(400).json({
        success: false,
        message: 'Fleet already exists',
      });
    }

    // HASH PASSWORD
    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    // CREATE FLEET
    const fleet = await Fleet.create({
      companyName,
      ownerName,
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      password: hashedPassword,
      city: city || '',
      address,
      role: 'fleet',
      status: 'online',
    });

    // TOKEN
    const token = jwt.sign(
      {
        id: fleet._id,
        role: 'fleet',
      },
      JWT_SECRET,
      {
        expiresIn: '30d',
      }
    );

    res.status(201).json({
      success: true,
      token,
      fleet: serializeFleet(fleet),
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

router.post('/register', registerFleet);
router.post('/signup', registerFleet);

// ===============================
// LOGIN
// ===============================
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password required',
      });
    }

    const fleet = await Fleet.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!fleet) {
      return res.status(400).json({
        success: false,
        message: 'Fleet not found',
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      fleet.password
    );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Invalid password',
      });
    }

    const token = jwt.sign(
      {
        id: fleet._id,
        role: 'fleet',
      },
      JWT_SECRET,
      {
        expiresIn: '30d',
      }
    );

    res.json({
      success: true,
      token,
      fleet: serializeFleet(fleet),
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = router;
