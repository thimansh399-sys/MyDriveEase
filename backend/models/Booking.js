const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver',
    default: null,
  },
  pickup: {
    address: { type: String, required: true },
    coordinates: {
      type: [Number], // [lng, lat]
      required: true,
    },
  },
  drop: {
    address: { type: String, required: true },
    coordinates: {
      type: [Number], // [lng, lat]
      required: true,
    },
  },
  distance: {
    type: Number, // in km
    required: true,
  },
  duration: {
    type: Number, // in minutes
    default: 0,
  },
  fare: {
    baseFare: { type: Number, default: 50 },
    distanceCost: { type: Number, default: 0 },
    insurance: { type: Number, default: 0 },
    insurancePlan: {
      type: String,
      enum: ['none', 'mini', 'premium'],
      default: 'none',
    },
    total: { type: Number, default: 0 },
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'arriving', 'in-progress', 'completed', 'cancelled'],
    default: 'pending',
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: null,
  },
  feedback: {
    type: String,
    default: '',
    maxlength: 500,
  },
  otp: {
    type: String,
    default: null,
  },
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
