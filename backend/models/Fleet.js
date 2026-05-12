const mongoose = require('mongoose');

const fleetSchema = new mongoose.Schema(
  {
    ownerName: {
      type: String,
      required: true,
    },

    companyName: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    city: {
      type: String,
      required: true,
    },

    address: String,

    gstNumber: String,

    aadhaarNumber: String,

    verified: {
      type: Boolean,
      default: false,
    },

    rating: {
      type: Number,
      default: 5,
    },

    totalTrips: {
      type: Number,
      default: 0,
    },

    earnings: {
      type: Number,
      default: 0,
    },

    totalCars: {
      type: Number,
      default: 1,
    },

    availableCars: {
      type: Number,
      default: 1,
    },

    cars: [
      {
        carType: {
          type: String,
          default: '',
        },
        carName: {
          type: String,
          default: '',
        },
        numberPlate: {
          type: String,
          default: '',
        },
      },
    ],

    status: {
      type: String,
      enum: ['online', 'offline'],
      default: 'online',
    },

    role: {
      type: String,
      default: 'fleet',
    },
  },

  {
    timestamps: true,
  }
);




module.exports = mongoose.model(
  'Fleet',
  fleetSchema
);