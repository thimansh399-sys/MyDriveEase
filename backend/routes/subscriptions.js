const express = require('express');

const router = express.Router();

router.post('/', async (req, res) => {
  const { name, phone, city, requirement } = req.body;

  if (!name || !phone) {
    return res.status(400).json({ message: 'Name and phone are required' });
  }

  res.status(201).json({
    success: true,
    subscription: {
      name,
      phone,
      city: city || '',
      requirement: requirement || '',
      userId: req.user?.id || null,
      createdAt: new Date().toISOString(),
    },
  });
});

module.exports = router;
