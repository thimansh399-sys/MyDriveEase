const express = require('express');

const router = express.Router();

const Driver = require('../models/Driver');

const {
  auth,
  requireRole,
} = require('../middleware/auth');


// ==========================================
// DRIVER LOGIN STATUS TOGGLE
// ==========================================

router.post(
  '/toggle-status',
  auth,
  requireRole('driver'),
  async (req, res) => {

    try {

      const driver = await Driver.findById(req.user.id);

      if (!driver) {

        return res.status(404).json({
          message: 'Driver not found',
        });

      }

      driver.status =
        driver.status === 'online'
          ? 'offline'
          : 'online';

      await driver.save();

      res.json({

        success: true,

        status: driver.status,

        message: `Driver is now ${driver.status}`,

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
// UPDATE DRIVER PROFILE
// ==========================================

router.put(
  '/me',
  auth,
  requireRole('driver'),
  async (req, res) => {

    try {

      const driver = await Driver.findById(req.user.id);

      if (!driver) {

        return res.status(404).json({
          message: 'Driver not found',
        });

      }

      driver.name =
        req.body.name || driver.name;

      driver.avatar =
        req.body.avatar || '';

      driver.aadhaarNumber =
        req.body.aadhaarNumber || '';

      driver.drivingLicenseNumber =
        req.body.drivingLicenseNumber || '';

      driver.experience =
        req.body.experience || '';

      driver.city =
        req.body.city || '';

      driver.area =
        req.body.area || '';

      await driver.save();

      res.json(driver);

    } catch (err) {

      console.log(err);

      res.status(500).json({
        message: 'Server error',
      });

    }
  }
);


// ==========================================
// SEARCH DRIVERS
// ==========================================

router.post('/search', async (req, res) => {

  try {

    const {
      pickup,
      drop,
    } = req.body;

    const query = {};

    query.status = 'online';

    if (
      pickup?.city ||
      pickup?.area ||
      drop?.city ||
      drop?.area
    ) {

      query.$or = [];

      if (pickup?.city) {

        query.$or.push({
          city: {
            $regex: pickup.city,
            $options: 'i',
          },
        });

      }

      if (pickup?.area) {

        query.$or.push({
          area: {
            $regex: pickup.area,
            $options: 'i',
          },
        });

      }

      if (drop?.city) {

        query.$or.push({
          city: {
            $regex: drop.city,
            $options: 'i',
          },
        });

      }

      if (drop?.area) {

        query.$or.push({
          area: {
            $regex: drop.area,
            $options: 'i',
          },
        });

      }

    }

    const drivers = await Driver.find(query)
      .select(
        'name phone status rating totalRides location city area'
      )
      .limit(50);

    res.json(drivers);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: 'Server error',
    });

  }
});


// ==========================================
// LOCATION SUGGESTIONS
// ==========================================

router.get('/suggestions', async (req, res) => {

  try {

    const {
      query = '',
    } = req.query;

    const drivers = await Driver.find({
      $or: [
        {
          city: {
            $regex: query,
            $options: 'i',
          },
        },
        {
          area: {
            $regex: query,
            $options: 'i',
          },
        },
      ],
    }).select('city area');

    const suggestions = [];

    drivers.forEach((driver) => {

      if (
        driver.city ||
        driver.area
      ) {

        suggestions.push({

          city: driver.city || '',

          area: driver.area || '',

        });

      }

    });

    res.json(suggestions);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: 'Server error',
    });

  }
});


// ==========================================
// NEARBY DRIVERS
// ==========================================

router.get(
  '/nearby',
  auth,
  async (req, res) => {

    try {

      const {
        lng,
        lat,
        maxDistance = 10000,
        minRating = 0,
      } = req.query;

      if (
        lng == null ||
        lat == null
      ) {

        return res.status(400).json({
          message: 'Coordinates required',
        });

      }

      const drivers = await Driver.find({

        status: 'online',

        rating: {
          $gte: parseFloat(minRating),
        },

        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [
                parseFloat(lng),
                parseFloat(lat),
              ],
            },
            $maxDistance: parseInt(maxDistance),
          },
        },

      })
        .select(
          'name phone status rating totalRides earnings location'
        )
        .limit(50);

      res.json(drivers);

    } catch (err) {

      console.log(
        'Nearby Drivers Error =>',
        err
      );

      res.status(500).json({
        message: 'Server error',
      });

    }
  }
);


// ==========================================
// GET ALL DRIVERS
// ==========================================

router.get(
  '/all',
  auth,
  async (req, res) => {

    try {

      const drivers = await Driver.find()
        .select(
          'name phone status rating totalRides earnings location city area'
        )
        .limit(100);

      res.json(drivers);

    } catch (err) {

      console.log(err);

      res.status(500).json({
        message: 'Server error',
      });

    }
  }
);


// ==========================================
// UPDATE DRIVER LIVE LOCATION
// ==========================================

router.post(
  '/update-location',
  auth,
  requireRole('driver'),
  async (req, res) => {

    try {

      const {
        lng,
        lat,
      } = req.body;

      if (
        lng == null ||
        lat == null
      ) {

        return res.status(400).json({
          message: 'Coordinates required',
        });

      }

      const driver = await Driver.findByIdAndUpdate(
        req.user.id,
        {

          location: {
            type: 'Point',
            coordinates: [
              parseFloat(lng),
              parseFloat(lat),
            ],
          },

        },
        {
          new: true,
        }
      );

      res.json({

        success: true,

        message: 'Location updated',

        location: driver.location,

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
// DRIVER PROFILE
// ==========================================

router.get(
  '/me',
  auth,
  requireRole('driver'),
  async (req, res) => {

    try {

      const driver = await Driver.findById(
        req.user.id
      ).select('-password');

      if (!driver) {

        return res.status(404).json({
          message: 'Driver not found',
        });

      }

      res.json(driver);

    } catch (err) {

      console.log(err);

      res.status(500).json({
        message: 'Server error',
      });

    }
  }
);

router.get(
  '/profile',
  auth,
  requireRole('driver'),
  async (req, res) => {

    try {

      const driver = await Driver.findById(
        req.user.id
      ).select('-password');

      if (!driver) {

        return res.status(404).json({
          message: 'Driver not found',
        });

      }

      res.json(driver);

    } catch (err) {

      console.log(err);

      res.status(500).json({
        message: 'Server error',
      });

    }
  }
);


// ==========================================
// GET DRIVER BY ID
// ==========================================

router.get('/:id', async (req, res) => {

  try {

    const driver = await Driver.findById(
      req.params.id
    ).select('-password');

    if (!driver) {

      return res.status(404).json({
        message: 'Driver not found',
      });

    }

    res.json(driver);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: 'Server error',
    });

  }
});


module.exports = router;
