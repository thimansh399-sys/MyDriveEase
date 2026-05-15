const express = require('express');

const Booking = require('../models/Booking');
const Driver = require('../models/Driver');
const Fleet = require('../models/Fleet');
const FleetVehicle = require('../models/FleetVehicle');
const User = require('../models/User');
const Payment = require('../models/Payment');
const { auth, requireRole } = require('../middleware/auth');

const router = express.Router();

router.use(auth, requireRole('admin'));

const getRangeStart = (days) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(0, 0, 0, 0);
  return date;
};

const buildDailySeries = (items, days, valueGetter) => {
  const labels = [];
  const values = [];

  for (let index = days - 1; index >= 0; index -= 1) {
    const date = new Date();
    date.setDate(date.getDate() - index);
    const key = date.toISOString().slice(0, 10);
    labels.push(key.slice(5));
    values.push(
      items
        .filter((item) => item.createdAt?.toISOString().slice(0, 10) === key)
        .reduce((sum, item) => sum + valueGetter(item), 0)
    );
  }

  return { labels, values };
};

router.get('/dashboard', async (req, res) => {
  try {
    const [
      bookings,
      drivers,
      fleets,
      vehicles,
      customers,
      payments,
    ] = await Promise.all([
      Booking.find({ createdAt: { $gte: getRangeStart(14) } }),
      Driver.find({}),
      Fleet.find({}),
      FleetVehicle.find({}),
      User.find({ role: 'user' }),
      Payment.find({}),
    ]);

    const allBookings = await Booking.find({});
    const pendingBookings = allBookings.filter((booking) => booking.status === 'pending');
    const stalePending = pendingBookings.filter(
      (booking) => Date.now() - new Date(booking.createdAt).getTime() > 5 * 60 * 1000
    );
    const ridesSeries = buildDailySeries(bookings, 7, () => 1);
    const revenueSeries = buildDailySeries(bookings, 7, (booking) => booking.fare?.total || 0);

    res.json({
      stats: {
        bookings: allBookings.length,
        drivers: drivers.length,
        registrations: customers.length + drivers.length + fleets.length,
        kyc: drivers.filter((driver) => driver.aadhaarNumber || driver.licenseNumber).length,
        customers: customers.length,
        enquiries: pendingBookings.length,
        liveDrivers: drivers.filter((driver) => driver.status === 'online').length,
        revenue: allBookings.reduce((sum, booking) => sum + (booking.fare?.total || 0), 0),
        pricing: vehicles.length,
        settings: fleets.length,
        pendingStale: stalePending.length,
        fleetVehicles: vehicles.length,
        paymentsSubmitted: payments.filter((payment) => payment.status === 'submitted').length,
      },
      charts: {
        ridesPerDay: ridesSeries.values,
        revenuePerDay: revenueSeries.values,
      },
      labels: ridesSeries.labels,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/control-room', async (req, res) => {
  try {
    const pending = await Booking.find({ status: 'pending' })
      .populate('userId', 'name phone')
      .sort({ createdAt: -1 })
      .limit(50);

    const availableVehicles = await FleetVehicle.find({ status: 'available' }).populate(
      'fleetId',
      'companyName ownerName phone city'
    );

    const items = pending.map((booking) => {
      const ageMinutes = Math.max(
        0,
        Math.floor((Date.now() - new Date(booking.createdAt).getTime()) / 60000)
      );
      const matchingVehicles = availableVehicles.filter((vehicle) => {
        if (booking.dispatchTarget === 'fleet' && vehicle.carType === booking.carType) return true;
        if (booking.tripType === 'driver-only' && vehicle.carType === 'driver-only') return true;
        return !booking.carType;
      });

      return {
        _id: booking._id,
        customer: booking.userId,
        pickup: booking.pickup,
        drop: booking.drop,
        fare: booking.fare,
        carType: booking.carType,
        dispatchTarget: booking.dispatchTarget,
        ageMinutes,
        matchingPartners: new Set(matchingVehicles.map((vehicle) => String(vehicle.fleetId?._id))).size,
        matchingVehicles: matchingVehicles.length,
        createdAt: booking.createdAt,
      };
    });

    res.json({
      items,
      summary: {
        pending: pending.length,
        stale: items.filter((item) => item.ageMinutes >= 5).length,
        noSupply: items.filter((item) => item.matchingVehicles === 0).length,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/notifications', async (req, res) => {
  try {
    const pendingCount = await Booking.countDocuments({ status: 'pending' });
    const submittedPayments = await Payment.countDocuments({ status: 'submitted' });

    res.json([
      {
        message: `${pendingCount} pending bookings need dispatch attention`,
        read: pendingCount === 0,
        date: new Date(),
      },
      {
        message: `${submittedPayments} payment proofs awaiting review`,
        read: submittedPayments === 0,
        date: new Date(),
      },
    ]);
  } catch {
    res.json([]);
  }
});

router.get('/audit-logs', async (req, res) => {
  res.json({
    items: [
      {
        event: 'Admin dashboard opened',
        actor: req.user.id,
        createdAt: new Date(),
      },
    ],
  });
});

router.get('/:type', async (req, res) => {
  try {
    const { type } = req.params;
    const page = Math.max(Number(req.query.page || 1), 1);
    const limit = 10;
    const skip = (page - 1) * limit;

    const modelMap = {
      bookings: Booking,
      drivers: Driver,
      customers: User,
      registrations: User,
      kyc: Driver,
      enquiries: Booking,
      liveDrivers: Driver,
      revenue: Booking,
      pricing: FleetVehicle,
      settings: Fleet,
    };

    const Model = modelMap[type];

    if (!Model) {
      return res.json({ items: [], total: 0 });
    }

    const query = {};

    if (type === 'customers' || type === 'registrations') query.role = 'user';
    if (type === 'enquiries') query.status = 'pending';
    if (type === 'liveDrivers') query.status = 'online';

    const [items, total] = await Promise.all([
      Model.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Model.countDocuments(query),
    ]);

    res.json({ items, total });
  } catch (err) {
    console.log(err);
    res.status(500).json({ items: [], total: 0 });
  }
});

module.exports = router;
