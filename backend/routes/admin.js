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

const toLowerText = (value) => String(value || '').toLowerCase();

const bookingMatchesSearch = (booking, search) => {
  if (!search) return true;

  const haystack = [
    booking._id,
    booking.userId?.name,
    booking.userId?.phone,
    booking.driverId?.name,
    booking.driverId?.phone,
    booking.fleetId?.companyName,
    booking.fleetId?.ownerName,
    booking.fleetVehicleId?.plateNumber,
    booking.pickup?.address,
    booking.drop?.address,
    booking.status,
    booking.tripType,
    booking.carType,
    booking.dispatchTarget,
  ]
    .map(toLowerText)
    .join(' ');

  return haystack.includes(toLowerText(search));
};

const buildMandateStatus = (booking, paymentMap) => {
  const checks = [
    {
      key: 'customer',
      label: 'Customer profile',
      done: Boolean(booking.userId?.name && booking.userId?.phone),
    },
    {
      key: 'route',
      label: 'Pickup/drop route',
      done: Boolean(booking.pickup?.address && booking.drop?.address),
    },
    {
      key: 'fare',
      label: 'Fare captured',
      done: Number(booking.fare?.total || 0) > 0,
    },
    {
      key: 'supply',
      label: booking.dispatchTarget === 'fleet' ? 'Fleet/cab assigned' : 'Driver assigned',
      done:
        booking.dispatchTarget === 'fleet'
          ? Boolean(booking.fleetId || booking.fleetVehicleId)
          : Boolean(booking.driverId),
    },
    {
      key: 'payment',
      label: 'Payment record',
      done: Boolean(paymentMap.get(String(booking._id))),
    },
  ];

  const missing = checks.filter((check) => !check.done).map((check) => check.label);

  return {
    checks,
    missing,
    score: Math.round(((checks.length - missing.length) / checks.length) * 100),
  };
};

const getKycStatus = (hasRequiredDocs, explicitStatus, verifiedFlag) => {
  if (verifiedFlag === true || explicitStatus === 'verified') return 'verified';
  if (explicitStatus === 'rejected') return 'rejected';
  if (hasRequiredDocs || explicitStatus === 'submitted') return 'submitted';
  return 'pending';
};

const buildKycItem = ({ id, type, name, phone, city, docs, status, createdAt }) => {
  const missing = docs.filter((doc) => !doc.done).map((doc) => doc.label);

  return {
    id,
    type,
    name: name || 'NA',
    phone: phone || 'NA',
    city: city || '',
    status,
    score: Math.round(((docs.length - missing.length) / docs.length) * 100),
    missing,
    docs,
    createdAt,
  };
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

router.get('/crm', async (req, res) => {
  try {
    const search = req.query.search || '';
    const status = req.query.status || 'all';
    const dispatchTarget = req.query.dispatchTarget || 'all';
    const limit = Math.min(Math.max(Number(req.query.limit || 80), 10), 200);

    const bookingQuery = {};
    if (status !== 'all') bookingQuery.status = status;
    if (dispatchTarget !== 'all') bookingQuery.dispatchTarget = dispatchTarget;

    const [bookings, customers, drivers, fleets, vehicles, payments] = await Promise.all([
      Booking.find(bookingQuery)
        .populate('userId', 'name phone role createdAt')
        .populate('driverId', 'name phone status rating totalRides aadhaarNumber licenseNumber city')
        .populate('fleetId', 'companyName ownerName phone city verified gstNumber aadhaarNumber status rating')
        .populate('fleetVehicleId', 'carType brand model plateNumber driverName driverPhone status serviceCity')
        .sort({ createdAt: -1 })
        .limit(300)
        .lean(),
      User.find({ role: 'user' }).lean(),
      Driver.find({}).lean(),
      Fleet.find({}).lean(),
      FleetVehicle.find({}).lean(),
      Payment.find({}).lean(),
    ]);

    const paymentMap = new Map(payments.map((payment) => [String(payment.bookingId), payment]));
    const visibleBookings = bookings.filter((booking) => bookingMatchesSearch(booking, search)).slice(0, limit);
    const now = Date.now();

    const statusKeys = ['pending', 'accepted', 'fleet-accepted', 'arriving', 'in-progress', 'completed', 'cancelled'];
    const statusBreakdown = statusKeys.map((key) => ({
      key,
      label: key.replace('-', ' '),
      count: bookings.filter((booking) => booking.status === key).length,
    }));

    const totalRevenue = bookings.reduce((sum, booking) => sum + Number(booking.fare?.total || 0), 0);
    const verifiedPayments = payments.filter((payment) => payment.status === 'verified');
    const pendingPayments = payments.filter((payment) => ['pending', 'submitted'].includes(payment.status));
    const staleBookings = bookings.filter(
      (booking) => booking.status === 'pending' && now - new Date(booking.createdAt).getTime() > 5 * 60 * 1000
    );

    const compliance = {
      driversWithDocuments: drivers.filter((driver) => driver.aadhaarNumber && driver.licenseNumber).length,
      driversMissingDocuments: drivers.filter((driver) => !driver.aadhaarNumber || !driver.licenseNumber).length,
      verifiedFleets: fleets.filter((fleet) => fleet.verified).length,
      fleetsMissingMandate: fleets.filter((fleet) => !fleet.gstNumber || !fleet.aadhaarNumber || !fleet.verified).length,
      vehiclesAvailable: vehicles.filter((vehicle) => vehicle.status === 'available').length,
      vehiclesOffline: vehicles.filter((vehicle) => vehicle.status === 'offline').length,
    };

    const kycItems = [
      ...customers.map((customer) => {
        const docs = [
          { key: 'phone', label: 'Phone number', done: Boolean(customer.phone) },
          { key: 'aadhaar', label: 'Aadhaar number', done: Boolean(customer.aadhaarNumber) },
          { key: 'aadhaarImage', label: 'Aadhaar image', done: Boolean(customer.aadhaarImage) },
        ];

        return buildKycItem({
          id: customer._id,
          type: 'customer',
          name: customer.name,
          phone: customer.phone,
          docs,
          status: getKycStatus(docs.every((doc) => doc.done), customer.kycStatus),
          createdAt: customer.createdAt,
        });
      }),
      ...drivers.map((driver) => {
        const docs = [
          { key: 'phone', label: 'Phone number', done: Boolean(driver.phone) },
          { key: 'aadhaar', label: 'Aadhaar number', done: Boolean(driver.aadhaarNumber) },
          { key: 'license', label: 'License number', done: Boolean(driver.licenseNumber) },
          { key: 'aadhaarImage', label: 'Aadhaar image', done: Boolean(driver.aadhaarImage) },
          { key: 'licenseImage', label: 'License image', done: Boolean(driver.licenseImage) },
        ];

        return buildKycItem({
          id: driver._id,
          type: 'driver',
          name: driver.name,
          phone: driver.phone,
          city: driver.city,
          docs,
          status: getKycStatus(docs.every((doc) => doc.done), driver.kycStatus),
          createdAt: driver.createdAt,
        });
      }),
      ...fleets.map((fleet) => {
        const docs = [
          { key: 'phone', label: 'Phone number', done: Boolean(fleet.phone) },
          { key: 'gst', label: 'GST number', done: Boolean(fleet.gstNumber) },
          { key: 'aadhaar', label: 'Owner Aadhaar', done: Boolean(fleet.aadhaarNumber) },
          { key: 'verified', label: 'Admin verified', done: Boolean(fleet.verified) },
        ];

        return buildKycItem({
          id: fleet._id,
          type: 'travel partner',
          name: fleet.companyName || fleet.ownerName,
          phone: fleet.phone,
          city: fleet.city,
          docs,
          status: getKycStatus(docs.every((doc) => doc.done), fleet.kycStatus, fleet.verified),
          createdAt: fleet.createdAt,
        });
      }),
    ];

    const kycSummary = {
      total: kycItems.length,
      verified: kycItems.filter((item) => item.status === 'verified').length,
      submitted: kycItems.filter((item) => item.status === 'submitted').length,
      pending: kycItems.filter((item) => item.status === 'pending').length,
      rejected: kycItems.filter((item) => item.status === 'rejected').length,
      customersPending: kycItems.filter((item) => item.type === 'customer' && item.status !== 'verified').length,
      driversPending: kycItems.filter((item) => item.type === 'driver' && item.status !== 'verified').length,
      travelPartnersPending: kycItems.filter((item) => item.type === 'travel partner' && item.status !== 'verified').length,
    };

    const crmBookings = visibleBookings.map((booking) => {
      const payment = paymentMap.get(String(booking._id));
      const mandate = buildMandateStatus(booking, paymentMap);
      const ageMinutes = Math.max(0, Math.floor((now - new Date(booking.createdAt).getTime()) / 60000));

      return {
        _id: booking._id,
        customer: booking.userId || null,
        driver: booking.driverId || null,
        fleet: booking.fleetId || null,
        vehicle: booking.fleetVehicleId || null,
        pickup: booking.pickup,
        drop: booking.drop,
        distance: booking.distance,
        duration: booking.duration,
        fare: booking.fare,
        tripType: booking.tripType,
        carType: booking.carType,
        dispatchTarget: booking.dispatchTarget,
        date: booking.date,
        time: booking.time,
        hours: booking.hours,
        status: booking.status,
        rating: booking.rating,
        feedback: booking.feedback,
        otp: booking.otp,
        payment: payment
          ? {
              amount: payment.amount,
              status: payment.status,
              reference: payment.reference,
              screenshotName: payment.screenshotName,
              createdAt: payment.createdAt,
            }
          : null,
        mandate,
        ageMinutes,
        createdAt: booking.createdAt,
        updatedAt: booking.updatedAt,
      };
    });

    res.json({
      summary: {
        totalBookings: bookings.length,
        activeBookings: bookings.filter((booking) =>
          ['pending', 'accepted', 'fleet-accepted', 'arriving', 'in-progress'].includes(booking.status)
        ).length,
        completedBookings: bookings.filter((booking) => booking.status === 'completed').length,
        cancelledBookings: bookings.filter((booking) => booking.status === 'cancelled').length,
        customers: customers.length,
        drivers: drivers.length,
        fleets: fleets.length,
        vehicles: vehicles.length,
        totalRevenue,
        verifiedRevenue: verifiedPayments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0),
        pendingPayments: pendingPayments.length,
        staleBookings: staleBookings.length,
      },
      statusBreakdown,
      compliance,
      kyc: {
        summary: kycSummary,
        items: kycItems.sort((a, b) => {
          if (a.status === b.status) return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
          const order = { pending: 0, submitted: 1, rejected: 2, verified: 3 };
          return order[a.status] - order[b.status];
        }),
      },
      directories: {
        customers: customers.map((customer) => ({
          id: customer._id,
          name: customer.name,
          phone: customer.phone,
          role: customer.role,
          kycStatus: customer.kycStatus || 'pending',
          aadhaarNumber: customer.aadhaarNumber || '',
          createdAt: customer.createdAt,
        })),
        drivers: drivers.map((driver) => ({
          id: driver._id,
          name: driver.name,
          phone: driver.phone,
          city: driver.city,
          status: driver.status,
          rating: driver.rating,
          totalRides: driver.totalRides,
          earnings: driver.earnings,
          kycStatus: driver.kycStatus || 'pending',
          aadhaarNumber: driver.aadhaarNumber || '',
          licenseNumber: driver.licenseNumber || '',
          createdAt: driver.createdAt,
        })),
        travelPartners: fleets.map((fleet) => ({
          id: fleet._id,
          name: fleet.companyName,
          ownerName: fleet.ownerName,
          phone: fleet.phone,
          city: fleet.city,
          status: fleet.status,
          verified: fleet.verified,
          kycStatus: fleet.kycStatus || 'pending',
          gstNumber: fleet.gstNumber || '',
          aadhaarNumber: fleet.aadhaarNumber || '',
          totalCars: fleet.totalCars,
          availableCars: fleet.availableCars,
          earnings: fleet.earnings,
          createdAt: fleet.createdAt,
        })),
      },
      bookings: crmBookings,
      generatedAt: new Date(),
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

router.post('/kyc/:entity/:id/:action', async (req, res) => {
  try {
    const { entity, id, action } = req.params;
    const { notes = '' } = req.body || {};

    if (!['approve', 'reject'].includes(action)) {
      return res.status(400).json({ message: 'Invalid KYC action' });
    }

    const status = action === 'approve' ? 'verified' : 'rejected';
    const update = {
      kycStatus: status,
      kycNotes: notes,
    };

    const modelMap = {
      customer: User,
      driver: Driver,
      fleet: Fleet,
      'travel-partner': Fleet,
      travelPartner: Fleet,
    };

    const Model = modelMap[entity];

    if (!Model) {
      return res.status(400).json({ message: 'Invalid KYC entity' });
    }

    if (Model === Fleet) update.verified = action === 'approve';

    const item = await Model.findByIdAndUpdate(id, update, { new: true }).lean();

    if (!item) {
      return res.status(404).json({ message: 'KYC record not found' });
    }

    res.json({
      success: true,
      entity,
      action,
      item,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/:type/approve', async (req, res) => {
  res.json({
    success: true,
    message: `${req.params.type} approved`,
    id: req.body.id,
  });
});

router.post('/:type/reject', async (req, res) => {
  res.json({
    success: true,
    message: `${req.params.type} rejected`,
    id: req.body.id,
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
