const express = require('express');
const Driver = require('../models/Driver');
const { auth, requireRole } = require('../middleware/auth');

const router = express.Router();

// GET /api/drivers/nearby?lng=XX&lat=YY&maxDistance=5000&minRating=0&status=online
router.get('/nearby', auth, async (req, res) => {
  try {
    const { lng, lat, maxDistance = 10000, minRating = 0, status } = req.query;

    if (!lng || !lat) {
      return res.status(400).json({ message: 'Coordinates (lng, lat) are required' });
    }

    const query = {
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },
          $maxDistance: parseInt(maxDistance),
        },
      },
      rating: { $gte: parseFloat(minRating) },
    };

    if (status && ['online', 'offline'].includes(status)) {
      query.status = status;
    }

    const drivers = await Driver.find(query)
      .select('name phone vehicle status location rating totalRides')
      .limit(50);

    res.json(drivers);
  } catch (err) {
    console.error('Nearby drivers error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/drivers/all — get all drivers (for demo/fallback)
router.get('/all', auth, async (req, res) => {
  try {
    const drivers = await Driver.find()
      .select('name phone vehicle status location rating totalRides')
      .limit(100);
    res.json(drivers);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/drivers/update-location
router.post('/update-location', auth, requireRole('driver'), async (req, res) => {
  try {
    const { lng, lat } = req.body;
    if (lng == null || lat == null) {
      return res.status(400).json({ message: 'Coordinates required' });
    }

    await Driver.findByIdAndUpdate(req.user.id, {
      location: {
        type: 'Point',
        coordinates: [parseFloat(lng), parseFloat(lat)],
      },
    });

    res.json({ message: 'Location updated' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/drivers/toggle-status
router.post('/toggle-status', auth, requireRole('driver'), async (req, res) => {
  try {
    const driver = await Driver.findById(req.user.id);
    if (!driver) return res.status(404).json({ message: 'Driver not found' });

    if (driver.status === 'on-ride') {
      return res.status(400).json({ message: 'Cannot toggle status during a ride' });
    }

    driver.status = driver.status === 'online' ? 'offline' : 'online';
    await driver.save();

    res.json({ status: driver.status });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/drivers/me - get current driver profile
router.get('/me', auth, requireRole('driver'), async (req, res) => {
  try {
    const driver = await Driver.findById(req.user.id);
    if (!driver) return res.status(404).json({ message: 'Driver not found' });
    res.json(driver);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
