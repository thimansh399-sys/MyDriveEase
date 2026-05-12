const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const driverSchema = new mongoose.Schema(
  {
    // =========================
    // BASIC INFO
    // =========================

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

    // =========================
    // DRIVER VERIFICATION
    // =========================

    aadhaarNumber: {
      type: String,
      required: true,
      trim: true,
    },

    licenseNumber: {
      type: String,
      required: true,
      trim: true,
    },

    experience: {
      type: Number,
      default: 0,
    },

    city: {
      type: String,
      default: '',
    },

    // =========================
    // DOCUMENTS
    // =========================

    profilePhoto: {
      type: String,
      default: '',
    },

    aadhaarImage: {
      type: String,
      default: '',
    },

    licenseImage: {
      type: String,
      default: '',
    },

    // =========================
    // DRIVER STATUS
    // =========================

    status: {
      type: String,
      enum: ['online', 'offline', 'on-ride'],
      default: 'offline',
    },

    // =========================
    // LIVE LOCATION
    // =========================

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

    // =========================
    // RATINGS
    // =========================

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
  },
  {
    timestamps: true,
  }
);

// =========================
// GEO INDEX
// =========================

driverSchema.index({
  location: '2dsphere',
});

// =========================
// HASH PASSWORD
// =========================

driverSchema.pre('save', async function (next) {

  if (!this.isModified('password')) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 12);

  next();
});

// =========================
// COMPARE PASSWORD
// =========================

driverSchema.methods.comparePassword =
  async function (candidatePassword) {

    return bcrypt.compare(
      candidatePassword,
      this.password
    );
  };

module.exports = mongoose.model(
  'Driver',
  driverSchema
);