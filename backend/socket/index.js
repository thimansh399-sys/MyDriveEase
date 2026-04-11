const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');
const Driver = require('../models/Driver');

const setupSocket = (io) => {
  // Auth middleware for socket
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error('Authentication error'));

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      socket.user = decoded;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.user.id} (${socket.user.role})`);

    // Join personal room
    if (socket.user.role === 'driver') {
      socket.join(`driver_${socket.user.id}`);
    } else {
      socket.join(`user_${socket.user.id}`);
    }

    // Driver sends location updates
    socket.on('driver-location-update', async (data) => {
      if (socket.user.role !== 'driver') return;

      const { lng, lat } = data;
      if (lng == null || lat == null) return;

      try {
        await Driver.findByIdAndUpdate(socket.user.id, {
          location: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },
        });

        // Broadcast to all connected clients
        socket.broadcast.emit('driver-moved', {
          driverId: socket.user.id,
          location: { lng: parseFloat(lng), lat: parseFloat(lat) },
        });
      } catch (err) {
        console.error('Location update error:', err);
      }
    });

    // Join booking room for real-time updates
    socket.on('join-booking', (bookingId) => {
      socket.join(`booking_${bookingId}`);
    });

    socket.on('leave-booking', (bookingId) => {
      socket.leave(`booking_${bookingId}`);
    });

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.user.id}`);
    });
  });
};

module.exports = setupSocket;
