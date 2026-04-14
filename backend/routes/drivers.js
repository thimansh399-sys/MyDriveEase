

const express = require('express');
const router = express.Router();
const Driver = require('../models/Driver');
const { auth, requireRole } = require('../middleware/auth');

// POST /api/drivers/toggle-status
router.post('/toggle-status', auth, requireRole('driver'), async (req, res) => {
  try {
    const driver = await Driver.findById(req.user.id);
    if (!driver) return res.status(404).json({ message: 'Driver not found' });
    driver.status = driver.status === 'online' ? 'offline' : 'online';
    await driver.save();
    res.json({ status: driver.status });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/drivers/search
router.post('/search', async (req, res) => {
  try {
    const { pickup, drop } = req.body;
    // pickup and drop can be objects: { city, area }
    let pickupQuery = [], dropQuery = [];
    if (pickup) {
      if (pickup.city) pickupQuery.push({ 'location.city': { $regex: pickup.city, $options: 'i' } });
      if (pickup.area) pickupQuery.push({ 'location.area': { $regex: pickup.area, $options: 'i' } });
    }
    if (drop) {
      if (drop.city) dropQuery.push({ 'location.city': { $regex: drop.city, $options: 'i' } });
      if (drop.area) dropQuery.push({ 'location.area': { $regex: drop.area, $options: 'i' } });
    }
    const drivers = await Driver.find({
      $or: [...pickupQuery, ...dropQuery],
    }).select('name phone vehicle status location rating totalRides');
    res.json(drivers);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/drivers/suggestions?query=del
router.get('/suggestions', async (req, res) => {
  try {
    const { query = '' } = req.query;
    // Get all cities and their areas from drivers
    const drivers = await Driver.find({
      $or: [
        { 'location.city': { $regex: query, $options: 'i' } },
        { 'location.state': { $regex: query, $options: 'i' } },
        { 'location.area': { $regex: query, $options: 'i' } },
      ],
    }).select('location');

    // Build city -> [areas] map
    const cityAreaMap = {};
    drivers.forEach(d => {
      const city = d.location?.city || '';
      const area = d.location?.area || '';
      if (city) {
        if (!cityAreaMap[city]) cityAreaMap[city] = new Set();
        if (area) cityAreaMap[city].add(area);
      }
    });

    // Build suggestions: [{ city, area }]
    const suggestions = [];
    Object.entries(cityAreaMap).forEach(([city, areas]) => {
      if (areas.size === 0) {
        suggestions.push({ city, area: '' });
      } else {
        areas.forEach(area => suggestions.push({ city, area }));
      }
    });

    res.json(suggestions);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

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

module.exports = router;
