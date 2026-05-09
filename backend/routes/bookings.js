const express = require('express');
const Booking = require('../models/Booking');
const Driver = require('../models/Driver');
const { auth, requireRole } = require('../middleware/auth');

const router = express.Router();

const BASE_FARE = 50;
const PER_KM_RATE = 12;

const INSURANCE_RATES = {
  none: 0,
  mini: 10,
  premium: 20,
};


// GET /api/bookings/available
router.get(
  '/available',
  auth,
  requireRole('driver'),
  async (req, res) => {

    try {

      const bookings = await Booking.find({
        status: 'pending',
        $or: [
          { driverId: null },
          { driverId: req.user.id },
        ],
      }).sort({ createdAt: -1 });

      res.json(bookings);

    } catch (err) {

      console.error('Available bookings error:', err);

      res.status(500).json({
        message: 'Server error',
      });
    }
  }
);


// POST /api/bookings/create
router.post(
  '/create',
  auth,
  requireRole('user'),
  async (req, res) => {

    try {

      const {
        pickup,
        drop,
        distance,
        duration,
        fare,
        driverId,
      } = req.body;

      // VALIDATION
      if (!pickup || !drop) {
        return res.status(400).json({
          message: 'Pickup and drop are required',
        });
      }

      if (distance === undefined || distance === null) {
        return res.status(400).json({
          message: 'Distance is required',
        });
      }

      const newBooking = await Booking.create({
        userId: req.user.id,
        pickup,
        drop,
        distance,
        duration: duration ?? 0,
        fare: {
          total: fare?.total ?? 0,
        },
        driverId: driverId || null,
      });

      res.status(201).json(newBooking);

    } catch (err) {

      res.status(500).json({
        message: 'Server error',
      });
    }
  }
);

// GET /api/bookings/user/my
router.get(
  '/user/my',
  auth,
  requireRole('user'),
  async (req, res) => {

    try {

      const bookings = await Booking.find({
        userId: req.user.id,
      })
        .populate('driverId', 'name phone vehicle rating')
        .sort({ createdAt: -1 });

      res.json(bookings);

    } catch (err) {

      res.status(500).json({
        message: 'Server error',
      });
    }
  }
);


// GET /api/bookings/driver/my
router.get(
  '/driver/my',
  auth,
  requireRole('driver'),
  async (req, res) => {

    try {

      const bookings = await Booking.find({
        driverId: req.user.id,
      })
        .populate('userId', 'name phone')
        .sort({ createdAt: -1 });

      res.json(bookings);

    } catch (err) {

      res.status(500).json({
        message: 'Server error',
      });
    }
  }
);


// POST /api/bookings/:id/accept
router.post(
  '/:id/accept',
  auth,
  requireRole('driver'),
  async (req, res) => {

    try {

      const booking = await Booking.findById(req.params.id);

      if (!booking) {

        return res.status(404).json({
          message: 'Booking not found',
        });
      }

      if (booking.status !== 'pending') {

        return res.status(400).json({
          message: 'Booking is not pending',
        });
      }

      booking.driverId = req.user.id;
      booking.status = 'accepted';

      await booking.save();

      await Driver.findByIdAndUpdate(
        req.user.id,
        {
          status: 'on-ride',
        }
      );

      if (req.app.get('io')) {

        req.app
          .get('io')
          .to(`booking_${booking._id}`)
          .emit('booking-accepted', {

            bookingId: booking._id,
            driverId: req.user.id,
          });
      }

      res.json(booking);

    } catch (err) {

      res.status(500).json({
        message: 'Server error',
      });
    }
  }
);


// POST /api/bookings/:id/start
router.post(
  '/:id/start',
  auth,
  requireRole('driver'),
  async (req, res) => {

    try {

      const booking = await Booking.findById(req.params.id);

      if (!booking) {

        return res.status(404).json({
          message: 'Booking not found',
        });
      }

      if (booking.status !== 'accepted') {

        return res.status(400).json({
          message: 'Booking not accepted yet',
        });
      }

      booking.status = 'in-progress';

      await booking.save();

      if (req.app.get('io')) {

        req.app
          .get('io')
          .to(`booking_${booking._id}`)
          .emit('ride-started', {

            bookingId: booking._id,
          });
      }

      res.json(booking);

    } catch (err) {

      res.status(500).json({
        message: 'Server error',
      });
    }
  }
);


// POST /api/bookings/:id/complete
router.post(
  '/:id/complete',
  auth,
  requireRole('driver'),
  async (req, res) => {

    try {

      const booking = await Booking.findById(req.params.id);

      if (!booking) {

        return res.status(404).json({
          message: 'Booking not found',
        });
      }

      if (booking.status !== 'in-progress') {

        return res.status(400).json({
          message: 'Ride not in progress',
        });
      }

      booking.status = 'completed';

      await booking.save();

      await Driver.findByIdAndUpdate(
        req.user.id,
        {
          status: 'online',
          $inc: {
            totalRides: 1,
            earnings: booking.fare.total,
          },
        }
      );

      if (req.app.get('io')) {

        req.app
          .get('io')
          .to(`booking_${booking._id}`)
          .emit('ride-completed', {

            bookingId: booking._id,
            fare: booking.fare,
          });
      }

      res.json(booking);

    } catch (err) {

      res.status(500).json({
        message: 'Server error',
      });
    }
  }
);


// POST /api/bookings/:id/cancel
router.post('/:id/cancel', auth, async (req, res) => {

  try {

    const booking = await Booking.findById(req.params.id);

    if (!booking) {

      return res.status(404).json({
        message: 'Booking not found',
      });
    }

    if (
      ['completed', 'cancelled'].includes(booking.status)
    ) {

      return res.status(400).json({
        message: 'Cannot cancel this booking',
      });
    }

    booking.status = 'cancelled';

    await booking.save();

    if (booking.driverId) {

      await Driver.findByIdAndUpdate(
        booking.driverId,
        {
          status: 'online',
        }
      );
    }

    if (req.app.get('io')) {

      req.app
        .get('io')
        .to(`booking_${booking._id}`)
        .emit('ride-cancelled', {

          bookingId: booking._id,
        });
    }

    res.json(booking);

  } catch (err) {

    res.status(500).json({
      message: 'Server error',
    });
  }
});


// POST /api/bookings/:id/rate
router.post(
  '/:id/rate',
  auth,
  requireRole('user'),
  async (req, res) => {

    try {

      const {
        rating,
        feedback,
      } = req.body;

      if (
        !rating ||
        rating < 1 ||
        rating > 5
      ) {

        return res.status(400).json({
          message: 'Rating must be between 1 and 5',
        });
      }

      const booking = await Booking.findById(req.params.id);

      if (!booking) {

        return res.status(404).json({
          message: 'Booking not found',
        });
      }

      if (booking.status !== 'completed') {

        return res.status(400).json({
          message: 'Can only rate completed rides',
        });
      }

      if (booking.rating) {

        return res.status(400).json({
          message: 'Already rated',
        });
      }

      booking.rating = rating;
      booking.feedback = feedback || '';

      await booking.save();

      if (booking.driverId) {

        const driver = await Driver.findById(
          booking.driverId
        );

        if (driver) {

          const newTotal =
            driver.totalRatings + 1;

          const newRating =
            (
              (
                driver.rating *
                driver.totalRatings
              ) + rating
            ) / newTotal;

          driver.rating = parseFloat(
            newRating.toFixed(2)
          );

          driver.totalRatings = newTotal;

          await driver.save();
        }
      }

      res.json({
        message: 'Rating submitted',
        booking,
      });

    } catch (err) {

      res.status(500).json({
        message: 'Server error',
      });
    }
  }
);


// GET /api/bookings/fare/estimate
router.get('/fare/estimate', auth, async (req, res) => {

  try {

    const { distance } = req.query;

    if (!distance) {

      return res.status(400).json({
        message: 'Distance is required',
      });
    }

    const dist = parseFloat(distance);

    const distanceCost = parseFloat(
      (dist * PER_KM_RATE).toFixed(2)
    );

    res.json({

      baseFare: BASE_FARE,

      distanceCost,

      perKmRate: PER_KM_RATE,

      insurance: INSURANCE_RATES,

      estimates: {

        none: parseFloat(
          (
            BASE_FARE +
            distanceCost
          ).toFixed(2)
        ),

        mini: parseFloat(
          (
            BASE_FARE +
            distanceCost +
            10
          ).toFixed(2)
        ),

        premium: parseFloat(
          (
            BASE_FARE +
            distanceCost +
            20
          ).toFixed(2)
        ),
      },
    });

  } catch (err) {

    res.status(500).json({
      message: 'Server error',
    });
  }
});




// GET /api/bookings/:id
router.get('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('userId', 'name phone')
      .populate('driverId', 'name phone vehicle rating location');

    if (!booking) {
      return res.status(404).json({
        message: 'Booking not found',
      });
    }

    res.json(booking);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Server error',
    });
  }
});

module.exports = router;
