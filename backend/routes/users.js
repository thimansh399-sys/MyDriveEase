const express = require('express');

const User = require('../models/User');
const { auth, requireRole } = require('../middleware/auth');

const router = express.Router();

router.put('/me', auth, requireRole('user'), async (req, res) => {
  try {
    const updates = {
      name: req.body.name,
      avatar: req.body.avatar || '',
    };

    Object.keys(updates).forEach((key) => {
      if (updates[key] === undefined) delete updates[key];
    });

    const user = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
      runValidators: true,
    }).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      id: user._id,
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar || '',
      role: user.role,
    });
  } catch (err) {
    console.log('USER PROFILE UPDATE ERROR =>', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
