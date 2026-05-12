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
      },

      brand: String,

      model: String,

      plateNumber: {
        type: String,
        required: true,
      },

      seats: Number,

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

module.exports = mongoose.model(
  'FleetVehicle',
  fleetVehicleSchema
);