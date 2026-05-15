const mongoose = require('mongoose');

const fleetVehicleSchema =
  new mongoose.Schema(
    {
      fleetId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Fleet',
        required: true,
      },

      carType: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
      },

      brand: String,

      model: String,

      plateNumber: {
        type: String,
        required: true,
      },

      seats: Number,

      serviceCity: {
        type: String,
        default: '',
        trim: true,
        lowercase: true,
      },

      perKmRate: {
        type: Number,
        default: 12,
        min: 0,
      },

      hourlyRate: {
        type: Number,
        default: 120,
        min: 0,
      },

      fullDayRate: {
        type: Number,
        default: 2500,
        min: 0,
      },

      driverName: String,

      driverPhone: String,

      status: {
        type: String,
        enum: [
          'available',
          'busy',
          'offline',
        ],
        default: 'available',
      },
    },
    {
      timestamps: true,
    }
  );

fleetVehicleSchema.index({
  fleetId: 1,
  plateNumber: 1,
}, {
  unique: true,
});

module.exports = mongoose.model(
  'FleetVehicle',
  fleetVehicleSchema
);
