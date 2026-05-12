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

// ==========================================
// DISTANCE CALCULATOR FUNCTION
// ==========================================

const calculateDistance = (
  pickupCoordinates,
  dropCoordinates
) => {

  try {

    if (
      !pickupCoordinates ||
      !dropCoordinates ||
      pickupCoordinates.length !== 2 ||
      dropCoordinates.length !== 2
    ) {

      return 0;

    }

    const [pLng, pLat] = pickupCoordinates;
    const [dLng, dLat] = dropCoordinates;

    if (
      pLng == null ||
      pLat == null ||
      dLng == null ||
      dLat == null
    ) {

      return 0;

    }

    const toRad = (value) =>
      (value * Math.PI) / 180;

    const R = 6371;

    const dLatRad = toRad(dLat - pLat);
    const dLngRad = toRad(dLng - pLng);

    const lat1 = toRad(pLat);
    const lat2 = toRad(dLat);

    const a =
      Math.sin(dLatRad / 2) *
        Math.sin(dLatRad / 2) +
      Math.cos(lat1) *
        Math.cos(lat2) *
        Math.sin(dLngRad / 2) *
        Math.sin(dLngRad / 2);

    const c =
      2 *
      Math.atan2(
        Math.sqrt(a),
        Math.sqrt(1 - a)
      );

    const distance = R * c;

    return Number(
      distance.toFixed(2)
    );

  } catch (err) {

    console.log(
      'DISTANCE ERROR =>',
      err
    );

    return 0;

  }
};

// ==========================================
// GET AVAILABLE BOOKINGS
// ==========================================

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

      console.log(err);

      res.status(500).json({
        message: 'Server error',
      });

    }
  }
);

// ==========================================
// CREATE NORMAL BOOKING
// ==========================================

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
        tripType,
        carType,
        date,
        time,
      } = req.body;

      if (!pickup || !drop) {

        return res.status(400).json({
          message:
            'Pickup and drop required',
        });

      }

      // ==================================
      // AUTO DISTANCE FIX
      // ==================================

      let finalDistance = distance;

      if (
        !finalDistance ||
        finalDistance === 0
      ) {

        finalDistance =
          calculateDistance(
            pickup.coordinates,
            drop.coordinates
          );

      }

      const booking =
        await Booking.create({

          userId: req.user.id,

          pickup: {
            address: pickup.address,
            coordinates:
              pickup.coordinates || [
                0,
                0,
              ],
          },

          drop: {
            address: drop.address,
            coordinates:
              drop.coordinates || [
                0,
                0,
              ],
          },

          distance:
            finalDistance || 0,

          duration:
            duration || 0,

          tripType:
            tripType || 'oneway',

          carType:
            carType || 'wagonr',

          date,
          time,

          fare: {
            total:
              fare?.total || 0,
          },

          driverId:
            driverId || null,

          status: 'pending',
        });

      res
        .status(201)
        .json(booking);

    } catch (err) {

      console.log(err);

      res.status(500).json({
        message: 'Server error',
      });

    }
  }
);

// ==========================================
// HIRE DRIVER ONLY
// ==========================================

router.post(
  '/hire-driver',
  auth,
  requireRole('user'),
  async (req, res) => {

    try {

      console.log(
        'BODY =>',
        req.body
      );

      const {
        pickup,
        drop,
        date,
        time,
        hours,
      } = req.body;

      if (!pickup || !drop) {

        return res.status(400).json({
          message:
            'Pickup & Drop required',
        });

      }

      // ==================================
      // FIX HOURS
      // ==================================

      let totalHours = 1;

      if (hours === '12 Hours') {

        totalHours = 12;

      } else if (
        hours === 'Full Day'
      ) {

        totalHours = 24;

      } else {

        const parsed =
          parseInt(hours);

        totalHours = isNaN(parsed)
          ? 1
          : parsed;
      }

      const totalFare =
        totalHours * 120;

      console.log(
        'TOTAL HOURS =>',
        totalHours
      );

      console.log(
        'TOTAL FARE =>',
        totalFare
      );

      // ==================================
      // FIND NEARBY DRIVERS
      // ==================================

      const nearbyDrivers =
        await Driver.find({

          status: 'online',

          location: {
            $near: {
              $geometry: {
                type: 'Point',
                coordinates:
                  pickup.coordinates || [
                    0,
                    0,
                  ],
              },
              $maxDistance: 20000,
            },
          },
        });

      console.log(
        'DRIVERS FOUND =>',
        nearbyDrivers.length
      );

      // ==================================
      // DISTANCE FIX
      // ==================================

      const calculatedDistance =
        calculateDistance(
          pickup.coordinates,
          drop.coordinates
        );

      console.log(
        'DISTANCE =>',
        calculatedDistance
      );

      // ==================================
      // CREATE BOOKING
      // ==================================

      const booking =
        await Booking.create({

          userId: req.user.id,

          pickup: {
            address: pickup.address,
            coordinates:
              pickup.coordinates || [
                0,
                0,
              ],
          },

          drop: {
            address: drop.address,
            coordinates:
              drop.coordinates || [
                0,
                0,
              ],
          },

          tripType: 'driver-only',

          carType: 'driver-only',

          date,
          time,

          hours: totalHours,

          distance:
            calculatedDistance,

          duration: totalHours,

          fare: {
            total: totalFare,
          },

          status: 'pending',
        });

      // ==================================
      // SOCKET EVENTS
      // ==================================

      if (req.app.get('io')) {

        nearbyDrivers.forEach(
          (driver) => {

            req.app
              .get('io')
              .to(
                `driver_${driver._id}`
              )
              .emit(
                'new-driver-booking',
                {

                  bookingId:
                    booking._id,

                  pickup:
                    booking.pickup,

                  drop:
                    booking.drop,

                  hours:
                    totalHours,

                  fare:
                    totalFare,

                  distance:
                    calculatedDistance,
                }
              );
          }
        );
      }

      res.status(201).json({

        success: true,

        message:
          'Driver request sent',

        driversNotified:
          nearbyDrivers.length,

        booking,
      });

    } catch (err) {

      console.log(
        'HIRE DRIVER ERROR =>',
        err
      );

      res.status(500).json({
        message: err.message,
      });

    }
  }
);

// ==========================================
// USER BOOKINGS
// ==========================================

router.get(
  '/user/my',
  auth,
  requireRole('user'),
  async (req, res) => {

    try {

      const bookings =
        await Booking.find({
          userId: req.user.id,
        })
          .populate(
            'driverId',
            'name phone vehicle rating'
          )
          .sort({
            createdAt: -1,
          });

      res.json(bookings);

    } catch (err) {

      res.status(500).json({
        message: 'Server error',
      });

    }
  }
);

// ==========================================
// DRIVER BOOKINGS
// ==========================================

router.get(
  '/driver/my',
  auth,
  requireRole('driver'),
  async (req, res) => {

    try {

      const bookings =
        await Booking.find({
          driverId: req.user.id,
        })
          .populate(
            'userId',
            'name phone'
          )
          .sort({
            createdAt: -1,
          });

      res.json(bookings);

    } catch (err) {

      res.status(500).json({
        message: 'Server error',
      });

    }
  }
);

// ==========================================
// ACCEPT BOOKING
// ==========================================

router.post(
  '/:id/accept',
  auth,
  requireRole('driver'),
  async (req, res) => {

    try {

      const booking =
        await Booking.findById(
          req.params.id
        );

      if (!booking) {

        return res.status(404).json({
          message:
            'Booking not found',
        });

      }

      booking.driverId =
        req.user.id;

      booking.status =
        'accepted';

      await booking.save();

      await Driver.findByIdAndUpdate(
        req.user.id,
        {
          status: 'on-ride',
        }
      );

      res.json(booking);

    } catch (err) {

      console.log(err);

      res.status(500).json({
        message: 'Server error',
      });

    }
  }
);

// ==========================================
// START RIDE
// ==========================================

router.post(
  '/:id/start',
  auth,
  requireRole('driver'),
  async (req, res) => {

    try {

      const booking =
        await Booking.findById(
          req.params.id
        );

      if (!booking) {

        return res.status(404).json({
          message:
            'Booking not found',
        });

      }

      booking.status =
        'in-progress';

      await booking.save();

      res.json(booking);

    } catch (err) {

      res.status(500).json({
        message: 'Server error',
      });

    }
  }
);

// ==========================================
// COMPLETE RIDE
// ==========================================

router.post(
  '/:id/complete',
  auth,
  requireRole('driver'),
  async (req, res) => {

    try {

      const booking =
        await Booking.findById(
          req.params.id
        );

      if (!booking) {

        return res.status(404).json({
          message:
            'Booking not found',
        });

      }

      booking.status =
        'completed';

      await booking.save();

      await Driver.findByIdAndUpdate(
        req.user.id,
        {
          status: 'online',

          $inc: {
            totalRides: 1,

            earnings:
              booking.fare.total,
          },
        }
      );

      res.json(booking);

    } catch (err) {

      res.status(500).json({
        message: 'Server error',
      });

    }
  }
);

// ==========================================
// CANCEL BOOKING
// ==========================================

router.post(
  '/:id/cancel',
  auth,
  async (req, res) => {

    try {

      const booking =
        await Booking.findById(
          req.params.id
        );

      if (!booking) {

        return res.status(404).json({
          message:
            'Booking not found',
        });

      }

      booking.status =
        'cancelled';

      await booking.save();

      if (booking.driverId) {

        await Driver.findByIdAndUpdate(
          booking.driverId,
          {
            status: 'online',
          }
        );
      }

      res.json(booking);

    } catch (err) {

      res.status(500).json({
        message: 'Server error',
      });

    }
  }
);

// ==========================================
// UPDATE DRIVER LOCATION
// ==========================================

router.post(
  '/update-location',
  auth,
  async (req, res) => {

    try {

      const { coordinates } =
        req.body;

      if (
        !coordinates ||
        coordinates.length !== 2
      ) {

        return res.status(400).json({
          message:
            'Coordinates required',
        });

      }

      await Driver.findByIdAndUpdate(
        req.user.id,
        {

          location: {
            type: 'Point',
            coordinates,
          },
        }
      );

      res.json({
        success: true,
        message:
          'Location updated',
      });

    } catch (err) {

      console.log(err);

      res.status(500).json({
        message: 'Server error',
      });

    }
  }
);

// ==========================================
// GET BOOKING BY ID
// ==========================================

// ==========================================
// SUBMIT RATING (User) for a completed booking
// POST /api/bookings/:id/rate
// ==========================================
router.post(
  '/:id/rate',
  auth,
  requireRole('user'),
  async (req, res) => {
    try {
      const { rating, feedback } = req.body;

      if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({
          success: false,
          message: 'Valid rating (1-5) is required',
        });
      }

      const booking = await Booking.findById(req.params.id);
      if (!booking) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found',
        });
      }

      if (String(booking.userId) !== String(req.user.id)) {
        return res.status(403).json({
          success: false,
          message: 'Not allowed to rate this booking',
        });
      }

      booking.rating = rating;
      booking.feedback = feedback || '';

      // Update driver rating (average) if driver exists
      if (booking.driverId) {
        await Driver.findByIdAndUpdate(
          booking.driverId,
          { rating: booking.rating },
          { new: true }
        );
      }

      // Mark booking completed if not already (optional safeguard)
      booking.status = booking.status === 'completed' ? booking.status : booking.status;

      await booking.save();

      // Notify driver via socket
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
      return res.status(500).json({
        success: false,
        message: 'Server error',
      });
    }
  }
);

router.get(
  '/:id',
  auth,
  async (req, res) => {

    try {

      const booking =
        await Booking.findById(
          req.params.id
        )
          .populate(
            'userId',
            'name phone'
          )
          .populate(
            'driverId',
            'name phone vehicle rating location'
          );

      if (!booking) {

        return res.status(404).json({
          message:
            'Booking not found',
        });

      }

      res.json(booking);

    } catch (err) {

      console.log(err);

      res.status(500).json({
        message: 'Server error',
      });

    }
  }
);

module.exports = router;