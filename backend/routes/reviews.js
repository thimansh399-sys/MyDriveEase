const express = require('express');

const router = express.Router();

router.get('/testimonials', (req, res) => {
  res.json([
    {
      name: 'Amit S.',
      avatar: '',
      rating: 5,
      text: 'DriveEase made my commute stress-free. Highly recommended!',
    },
    {
      name: 'Priya R.',
      avatar: '',
      rating: 4,
      text: 'Professional drivers and easy booking process.',
    },
    {
      name: 'Rahul K.',
      avatar: '',
      rating: 5,
      text: 'Best experience with reliable support.',
    },
  ]);
});

module.exports = router;
