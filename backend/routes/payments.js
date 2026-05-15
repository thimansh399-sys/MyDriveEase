const express = require('express');

const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const { auth, requireRole } = require('../middleware/auth');

const router = express.Router();

router.get('/my', auth, requireRole('user'), async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.user.id })
      .populate('bookingId', 'pickup drop fare status createdAt')
      .sort({ createdAt: -1 });

    res.json(payments);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/booking/:bookingId', auth, requireRole('user'), async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.bookingId,
      userId: req.user.id,
    })
      .populate('driverId', 'name phone rating vehicle')
      .populate('fleetId', 'companyName ownerName phone')
      .populate('fleetVehicleId', 'carType brand model plateNumber driverName driverPhone');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    let payment = await Payment.findOne({
      userId: req.user.id,
      bookingId: booking._id,
    });

    if (!payment) {
      payment = await Payment.create({
        userId: req.user.id,
        bookingId: booking._id,
        amount: booking.fare?.total || 0,
      });
    }

    res.json({
      booking,
      payment,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/upload', auth, requireRole('user'), async (req, res) => {
  try {
    const {
      bookingId,
      reference,
      screenshotData,
      screenshotName,
    } = req.body;

    if (!bookingId) {
      return res.status(400).json({ message: 'Booking ID required' });
    }

    const booking = await Booking.findOne({
      _id: bookingId,
      userId: req.user.id,
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const payment = await Payment.findOneAndUpdate(
      {
        userId: req.user.id,
        bookingId,
      },
      {
        amount: booking.fare?.total || 0,
        reference: reference || '',
        screenshotData: screenshotData || '',
        screenshotName: screenshotName || '',
        status: 'submitted',
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );

    res.json({
      success: true,
      payment,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
