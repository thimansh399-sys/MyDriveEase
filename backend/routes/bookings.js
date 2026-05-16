const express = require('express');

const Booking = require('../models/Booking');
const Driver = require('../models/Driver');
const Fleet = require('../models/Fleet');
const FleetVehicle = require('../models/FleetVehicle');

const { auth, requireRole } = require('../middleware/auth');

const router = express.Router();

const INSURANCE_RATES = {
  none: 0,
  mini: 10,
  premium: 20,
};

const FLEET_CAR_TYPE_ALIASES = {
  wagonr: 'hatchback',
  swift: 'hatchback',
  ertiga: 'suv',
  rumion: 'suv',
  innova: 'innova',
  'innova-crysta': 'innova',
};

const normalizeFleetCarType = (carType) => {
  const value = String(carType || '').trim().toLowerCase();
  return FLEET_CAR_TYPE_ALIASES[value] || value || 'hatchback';
};

// ==========================================
// DISTANCE CALCULATOR FUNCTION
// ==========================================

const calculateDistance = (pickupCoordinates, dropCoordinates) => {
  try {
    if (!pickupCoordinates || !dropCoordinates) return 0;
    if (pickupCoordinates.length !== 2 || dropCoordinates.length !== 2) return 0;

    const [pLng, pLat] = pickupCoordinates;
    const [dLng, dLat] = dropCoordinates;

    if (pLng == null || pLat == null || dLng == null || dLat == null) return 0;

    const toRad = (value) => (value * Math.PI) / 180;

    const R = 6371;

    const dLatRad = toRad(dLat - pLat);
    const dLngRad = toRad(dLng - pLng);

    const lat1 = toRad(pLat);
    const lat2 = toRad(dLat);

    const a =
      Math.sin(dLatRad / 2) * Math.sin(dLatRad / 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLngRad / 2) * Math.sin(dLngRad / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return Number(distance.toFixed(2));
  } catch (err) {
    console.log('DISTANCE ERROR =>', err);
    return 0;
  }
};

// ==========================================
// GET AVAILABLE BOOKINGS
// ==========================================

router.get('/available', auth, requireRole('driver'), async (req, res) => {
  try {
    const bookings = await Booking.find({
      status: 'pending',
      dispatchTarget: { $ne: 'fleet' },
      $or: [{ driverId: null }, { driverId: req.user.id }],
    }).sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ==========================================
// CREATE NORMAL BOOKING
// ==========================================

router.post('/create', auth, requireRole('user'), async (req, res) => {
  try {
    const {
      pickup,
      drop,
      distance,
      duration,
      fare,
      driverId,
      tripType,
      carType,
      date,
      time,
      dispatchTarget,
    } = req.body;

    if (!pickup || !drop) {
      return res.status(400).json({ message: 'Pickup and drop required' });
    }

    let finalDistance = distance;
    if (!finalDistance || finalDistance === 0) {
      finalDistance = calculateDistance(pickup.coordinates, drop.coordinates);
    }

    const booking = await Booking.create({
      userId: req.user.id,

      pickup: {
        address: pickup.address,
        coordinates: pickup.coordinates || [0, 0],
      },

      drop: {
        address: drop.address,
        coordinates: drop.coordinates || [0, 0],
      },

      distance: finalDistance || 0,
      duration: duration || 0,

      tripType: tripType || 'oneway',
      carType: dispatchTarget === 'fleet' ? normalizeFleetCarType(carType) : carType || 'wagonr',
      dispatchTarget: dispatchTarget === 'fleet' ? 'fleet' : 'driver',

      date,
      time,

      fare: {
        total: typeof fare === 'number' ? fare : fare?.total || 0,
      },

      driverId: driverId || null,
      fleetId: null,
      fleetVehicleId: null,

      status: 'pending',
    });

    if (dispatchTarget === 'fleet' && req.app.get('io')) {
      const matchingVehicles = await FleetVehicle.find({
        status: 'available',
        carType: normalizeFleetCarType(carType),
      }).select('fleetId');

      const fleetIds = [...new Set(matchingVehicles.map((v) => String(v.fleetId)))];

      fleetIds.forEach((fleetId) => {
        req.app.get('io').to(`fleet_${fleetId}`).emit('new-fleet-booking', {
          bookingId: booking._id,
          pickup: booking.pickup,
          drop: booking.drop,
          fare: booking.fare?.total || 0,
          distance: booking.distance,
          carType: booking.carType,
        });
      });
    }

    res.status(201).json(booking);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ==========================================
// HIRE DRIVER / CAB + DRIVER
// ==========================================

router.post('/hire-driver', auth, requireRole('user'), async (req, res) => {
  try {
    const { pickup, drop, date, time, hours } = req.body;
    if (!pickup || !drop) {
      return res.status(400).json({ message: 'Pickup & Drop required' });
    }

    let totalHours = 1;
    if (hours === '12 Hours') totalHours = 12;
    else if (hours === 'Full Day') totalHours = 24;
    else {
      const parsed = parseInt(hours);
      totalHours = isNaN(parsed) ? 1 : parsed;
    }

    const totalFare = totalHours * 120;

    const calculatedDistance = calculateDistance(pickup.coordinates, drop.coordinates);

    const onlineFleets = await Fleet.find({ status: 'online' });

    const booking = await Booking.create({
      userId: req.user.id,
      pickup: { address: pickup.address, coordinates: pickup.coordinates || [0, 0] },
      drop: { address: drop.address, coordinates: drop.coordinates || [0, 0] },
      tripType: 'driver-only',
      carType: 'driver-only',
      dispatchTarget: 'fleet',
      date,
      time,
      hours: totalHours,
      distance: calculatedDistance,
      duration: totalHours,
      fare: { total: totalFare },
      fleetId: null,
      fleetVehicleId: null,
      driverId: null,
      status: 'pending',
    });

    if (req.app.get('io')) {
      onlineFleets.forEach((fleet) => {
        req.app.get('io')
          .to(`fleet_${fleet._id}`)
          .emit('new-fleet-booking', {
            bookingId: booking._id,
            pickup: booking.pickup,
            drop: booking.drop,
            hours: totalHours,
            fare: totalFare,
            distance: calculatedDistance,
          });
      });
    }

    res.status(201).json({
      success: true,
      message: 'Fleet booking request sent',
      fleetsNotified: onlineFleets.length,
      booking,
    });
  } catch (err) {
    console.log('HIRE DRIVER ERROR =>', err);
    res.status(500).json({ message: err.message });
  }
});

// ==========================================
// USER BOOKINGS
// ==========================================

router.get('/user/my', auth, requireRole('user'), async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id })
      .populate('driverId', 'name phone vehicle rating')
      .populate('fleetId', 'companyName ownerName phone')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ==========================================
// DRIVER BOOKINGS
// ==========================================

router.get('/driver/my', auth, requireRole('driver'), async (req, res) => {
  try {
    const bookings = await Booking.find({ driverId: req.user.id })
      .populate('userId', 'name phone')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ==========================================
// FLEET BOOKINGS
// ==========================================

router.get('/fleet/my', auth, requireRole('fleet'), async (req, res) => {
  try {
    const bookings = await Booking.find({ fleetId: req.user.id })
      .populate('userId', 'name phone')
      .sort({ createdAt: -1 });

    res.json({ success: true, bookings });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ==========================================
// FLEET ACCEPT BOOKING
// ==========================================

router.post('/fleet/:id/accept', auth, requireRole('fleet'), async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'Booking already accepted' });
    }

    const { fleetVehicleId } = req.body;

    const vehicleQuery = {
      fleetId: req.user.id,
      status: 'available',
    };

    // Choose cab by either fleetVehicleId or based on booking details
    if (fleetVehicleId) {
      vehicleQuery._id = fleetVehicleId;
    } else if (booking.tripType === 'driver-only') {
      vehicleQuery.carType = 'driver-only';
    } else if (booking.carType) {
      vehicleQuery.carType = booking.carType;
    }

    let vehicle = await FleetVehicle.findOne(vehicleQuery).sort({ updatedAt: -1 });

    if (!vehicle && !fleetVehicleId) {
      vehicle = await FleetVehicle.findOne({ fleetId: req.user.id, status: 'available' }).sort({ updatedAt: -1 });
    }

    if (!vehicle) {
      return res.status(400).json({
        success: false,
        message: fleetVehicleId ? 'Selected cab is not available' : 'No available cab found. Mark a cab available first.',
      });
    }

    booking.fleetId = req.user.id;
    booking.fleetVehicleId = vehicle._id;
    booking.status = 'fleet-accepted';

    await booking.save();

    // Mark vehicle busy if possible
    vehicle.status = 'busy';
    await vehicle.save();

    if (req.app.get('io')) {
      req.app.get('io').to(`user_${booking.userId}`).emit('fleet-booking-accepted', {
        bookingId: booking._id,
        fleetId: booking.fleetId,
        status: booking.status,
      });
    }

    res.json({ success: true, booking });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ==========================================
// FLEET COMPLETE BOOKING
// ==========================================

router.post('/fleet/:id/complete', auth, requireRole('fleet'), async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, fleetId: req.user.id });
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    booking.status = 'completed';
    await booking.save();

    if (booking.fleetVehicleId) {
      await FleetVehicle.findOneAndUpdate(
        { _id: booking.fleetVehicleId, fleetId: req.user.id },
        { status: 'available' }
      );
    }

    res.json({ success: true, booking });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ==========================================
// FLEET CANCEL ACCEPTED BOOKING
// ==========================================

router.post('/fleet/:id/cancel', auth, requireRole('fleet'), async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, fleetId: req.user.id });
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    const vehicleId = booking.fleetVehicleId;

    booking.fleetId = null;
    booking.fleetVehicleId = null;
    booking.status = 'pending';
    await booking.save();

    if (vehicleId) {
      await FleetVehicle.findOneAndUpdate({ _id: vehicleId, fleetId: req.user.id }, { status: 'available' });
    }

    res.json({ success: true, booking });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ==========================================
// DRIVER ACCEPT BOOKING
// ==========================================

router.post('/:id/accept', auth, requireRole('driver'), async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.status !== 'pending') return res.status(400).json({ message: 'Booking already accepted' });

    if (booking.driverId && String(booking.driverId) !== String(req.user.id)) {
      return res.status(403).json({ message: 'This booking is assigned to another driver' });
    }

    booking.driverId = req.user.id;
    booking.status = 'accepted';

    await booking.save();

    await Driver.findByIdAndUpdate(req.user.id, { status: 'on-ride' });
    res.json(booking);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ==========================================
// START RIDE
// ==========================================

router.post('/:id/start', auth, requireRole('driver'), async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    booking.status = 'in-progress';
    await booking.save();

    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ==========================================
// COMPLETE RIDE
// ==========================================

router.post('/:id/complete', auth, requireRole('driver'), async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    booking.status = 'completed';
    await booking.save();

    await Driver.findByIdAndUpdate(req.user.id, {
      status: 'online',
      $inc: {
        totalRides: 1,
        earnings: booking.fare?.total,
      },
    });

    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ==========================================
// CANCEL BOOKING
// ==========================================

router.post('/:id/cancel', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    booking.status = 'cancelled';
    await booking.save();

    if (booking.driverId) {
      await Driver.findByIdAndUpdate(booking.driverId, { status: 'online' });
    }

    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ==========================================
// UPDATE DRIVER LOCATION
// ==========================================

router.post('/update-location', auth, async (req, res) => {
  try {
    const { coordinates } = req.body;

    if (!coordinates || coordinates.length !== 2) {
      return res.status(400).json({ message: 'Coordinates required' });
    }

    await Driver.findByIdAndUpdate(req.user.id, {
      location: {
        type: 'Point',
        coordinates,
      },
    });

    res.json({ success: true, message: 'Location updated' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ==========================================
// SUBMIT RATING
// ==========================================

router.post('/:id/rate', auth, requireRole('user'), async (req, res) => {
  try {
    const { rating, feedback } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: 'Valid rating (1-5) is required' });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

    if (String(booking.userId) !== String(req.user.id)) {
      return res.status(403).json({ success: false, message: 'Not allowed to rate this booking' });
    }

    booking.rating = rating;
    booking.feedback = feedback || '';

    if (booking.driverId) {
      await Driver.findByIdAndUpdate(booking.driverId, { rating: booking.rating }, { new: true });
    }

    await booking.save();

    if (req.app.get('io') && booking.driverId) {
      req.app
        .get('io')
        .to(`driver_${booking.driverId}`)
        .emit('ride-rated', {
          bookingId: booking._id,
          driverId: booking.driverId,
          userId: booking.userId,
          rating: booking.rating,
          feedback: booking.feedback,
        });
    }

    return res.json({ success: true, booking });
  } catch (err) {
    console.error('Rate error =>', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ==========================================
// FLEET AVAILABLE BOOKINGS
// ==========================================

router.get('/fleet/available', auth, requireRole('fleet'), async (req, res) => {
  try {
    const bookings = await Booking.find({
      status: 'pending',
      dispatchTarget: 'fleet',
    }).sort({ createdAt: -1 });

    res.json({ success: true, bookings });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ==========================================
// GET BOOKING BY ID
// ==========================================

router.get('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('userId', 'name phone')
      .populate('driverId', 'name phone vehicle rating location')
      .populate('fleetId', 'companyName ownerName phone')
      .populate('fleetVehicleId', 'carType brand model plateNumber driverName driverPhone perKmRate hourlyRate fullDayRate');

    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    res.json(booking);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

