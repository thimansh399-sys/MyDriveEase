const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const driverSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: 100,
  },
  phone: {
    type: String,
    required: [true, 'Phone is required'],
    unique: true,
    trim: true,
    match: [/^\d{10,15}$/, 'Invalid phone number'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    select: false,
  },
  role: {
    type: String,
    default: 'driver',
    immutable: true,
  },
  vehicle: {
    type: {
      type: String,
      enum: ['sedan', 'suv', 'hatchback', 'auto', 'bike'],
      default: 'sedan',
    },
    model: { type: String, default: '' },
    plate: { type: String, default: '' },
  },
  status: {
    type: String,
    enum: ['online', 'offline', 'on-ride'],
    default: 'offline',
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number], // [lng, lat]
      default: [0, 0],
    },
  },
  rating: {
    type: Number,
    default: 5,
    min: 1,
    max: 5,
  },
  totalRatings: {
    type: Number,
    default: 0,
  },
  totalRides: {
    type: Number,
    default: 0,
  },
  earnings: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

driverSchema.index({ location: '2dsphere' });

driverSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

driverSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Driver', driverSchema);
