const express = require('express');

const Booking = require('../models/Booking');
const FleetVehicle = require('../models/FleetVehicle');
const { auth, requireRole } = require('../middleware/auth');

const router = express.Router();

const normalizeVehiclePayload = (body) => ({
  carType: String(body.carType || '').trim().toLowerCase(),
  brand: body.brand || '',
  model: body.model || '',
  plateNumber: String(body.plateNumber || '').trim().toUpperCase(),
  seats: Number(body.seats || 4),
  serviceCity: String(body.serviceCity || '').trim().toLowerCase(),
  perKmRate: Number(body.perKmRate || 0),
  hourlyRate: Number(body.hourlyRate || 0),
  fullDayRate: Number(body.fullDayRate || 0),
  driverName: body.driverName || '',
  driverPhone: body.driverPhone || '',
  status: body.status || 'available',
});

router.get('/vehicles', auth, requireRole('fleet'), async (req, res) => {
  try {
    const vehicles = await FleetVehicle.find({
      fleetId: req.user.id,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      vehicles,
    });
  } catch (err) {
    console.log('FLEET VEHICLES LIST ERROR =>', err);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

router.post('/vehicles', auth, requireRole('fleet'), async (req, res) => {
  try {
    const payload = normalizeVehiclePayload(req.body);

    if (!payload.carType || !payload.plateNumber) {
      return res.status(400).json({
        success: false,
        message: 'Car type and plate number are required',
      });
    }

    const vehicle = await FleetVehicle.create({
      ...payload,
      fleetId: req.user.id,
    });

    res.status(201).json({
      success: true,
      vehicle,
    });
  } catch (err) {
    console.log('FLEET VEHICLE CREATE ERROR =>', err);

    const message = err.code === 11000
      ? 'This plate number is already registered in your fleet'
      : 'Server error';

    res.status(err.code === 11000 ? 400 : 500).json({
      success: false,
      message,
    });
  }
});

router.put('/vehicles/:id', auth, requireRole('fleet'), async (req, res) => {
  try {
    const payload = normalizeVehiclePayload(req.body);

    const vehicle = await FleetVehicle.findOneAndUpdate(
      {
        _id: req.params.id,
        fleetId: req.user.id,
      },
      payload,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found',
      });
    }

    res.json({
      success: true,
      vehicle,
    });
  } catch (err) {
    console.log('FLEET VEHICLE UPDATE ERROR =>', err);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

router.patch('/vehicles/:id/status', auth, requireRole('fleet'), async (req, res) => {
  try {
    const { status } = req.body;

    if (!['available', 'busy', 'offline'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid vehicle status',
      });
    }

    const vehicle = await FleetVehicle.findOneAndUpdate(
      {
        _id: req.params.id,
        fleetId: req.user.id,
      },
      { status },
      { new: true }
    );

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found',
      });
    }

    res.json({
      success: true,
      vehicle,
    });
  } catch (err) {
    console.log('FLEET VEHICLE STATUS ERROR =>', err);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

router.delete('/vehicles/:id', auth, requireRole('fleet'), async (req, res) => {
  try {
    const activeBooking = await Booking.findOne({
      fleetVehicleId: req.params.id,
      status: {
        $in: ['fleet-accepted', 'arriving', 'in-progress'],
      },
    });

    if (activeBooking) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete a cab assigned to an active booking',
      });
    }

    const vehicle = await FleetVehicle.findOneAndDelete({
      _id: req.params.id,
      fleetId: req.user.id,
    });

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found',
      });
    }

    res.json({
      success: true,
    });
  } catch (err) {
    console.log('FLEET VEHICLE DELETE ERROR =>', err);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

module.exports = router;
