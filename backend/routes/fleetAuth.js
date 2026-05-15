const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Fleet = require('../models/Fleet');
const { JWT_SECRET } = require('../config');

const router = express.Router();

// ===============================
// REGISTER
// ===============================
router.post('/register', async (req, res) => {
  try {

    console.log(req.body);
    const {
      companyName,
      ownerName,
      email,
      phone,
      password,
      address,
    } = req.body;

    // CHECK EXISTING
    const existingFleet = await Fleet.findOne({
      $or: [{ email }, { phone }],
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
      email,
      phone,
      password: hashedPassword,
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
      fleet,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// ===============================
// LOGIN
// ===============================
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const fleet = await Fleet.findOne({
      email,
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
      fleet,
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
