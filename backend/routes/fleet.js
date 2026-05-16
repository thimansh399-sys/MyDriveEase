const express = require('express');

const Booking = require('../models/Booking');
const Fleet = require('../models/Fleet');
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

router.get('/dashboard', auth, requireRole('fleet'), async (req, res) => {
  try {
    const fleetId = req.user.id;

    const [profile, vehicles, availableBookings, myBookings] = await Promise.all([
      Fleet.findById(fleetId).select('-password').lean(),
      FleetVehicle.find({ fleetId }).sort({ createdAt: -1 }).lean(),
      Booking.find({ status: 'pending', dispatchTarget: 'fleet' })
        .populate('userId', 'name phone')
        .sort({ createdAt: -1 })
        .limit(12)
        .lean(),
      Booking.find({ fleetId })
        .populate('userId', 'name phone')
        .populate('fleetVehicleId', 'carType brand model plateNumber driverName driverPhone')
        .sort({ createdAt: -1 })
        .limit(20)
        .lean(),
    ]);

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Fleet profile not found',
      });
    }

    const activeStatuses = ['fleet-accepted', 'arriving', 'in-progress'];
    const completedBookings = myBookings.filter((booking) => booking.status === 'completed');

    res.json({
      success: true,
      profile,
      stats: {
        availableLeads: availableBookings.length,
        acceptedBookings: myBookings.length,
        activeBookings: myBookings.filter((booking) => activeStatuses.includes(booking.status)).length,
        completedBookings: completedBookings.length,
        revenue: completedBookings.reduce((sum, booking) => sum + Number(booking.fare?.total || 0), 0),
        totalCabs: vehicles.length,
        availableCabs: vehicles.filter((vehicle) => vehicle.status === 'available').length,
        busyCabs: vehicles.filter((vehicle) => vehicle.status === 'busy').length,
        offlineCabs: vehicles.filter((vehicle) => vehicle.status === 'offline').length,
      },
      vehicles,
      availableBookings,
      myBookings,
    });
  } catch (err) {
    console.log('FLEET DASHBOARD ERROR =>', err);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
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
