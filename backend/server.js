const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { Server } = require('socket.io');

const connectDB = require('./config/db');
const { PORT } = require('./config');
const setupSocket = require('./socket');

// ROUTES
const authRoutes = require('./routes/auth');
const fleetAuthRoutes = require('./routes/fleetAuth');
const fleetRoutes = require('./routes/fleet');
const driverRoutes = require('./routes/drivers');
const bookingRoutes = require('./routes/bookings');
const paymentRoutes = require('./routes/payments');
const adminRoutes = require('./routes/admin');

// ❌ REMOVE THIS LINE
// const driverAuthRoutes = require('./routes/driverAuth');

const app = express();
const server = http.createServer(app);


// ==========================================
// SOCKET.IO
// ==========================================

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

app.set('io', io);


// ==========================================
// SECURITY
// ==========================================

app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);


// ==========================================
// CORS
// ==========================================

app.use(
  cors({
    origin: '*',
    methods: [
      'GET',
      'POST',
      'PUT',
      'PATCH',
      'DELETE',
      'OPTIONS',
    ],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
    ],
  })
);

app.options('*', cors());


// ==========================================
// BODY PARSER
// ==========================================

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));


// ==========================================
// RATE LIMITER
// ==========================================

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: {
    message:
      'Too many requests, please try again later',
  },
});

app.use('/api/', limiter);


// ==========================================
// ROUTES
// ==========================================

// USER + DRIVER AUTH
app.use('/api/auth', authRoutes);

// FLEET OWNER AUTH
app.use('/api/fleet-auth', fleetAuthRoutes);

// DRIVER ROUTES
app.use('/api/drivers', driverRoutes);

// BOOKINGS
app.use('/api/bookings', bookingRoutes);

// FLEET ROUTES
app.use('/api/fleet', fleetRoutes);

// PAYMENTS
app.use('/api/payments', paymentRoutes);

// ADMIN
app.use('/api/admin', adminRoutes);




// ==========================================
// ROOT ROUTE
// ==========================================

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'DriveEase Backend Running 🚀',
  });
});


// ==========================================
// HEALTH CHECK
// ==========================================

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});


// ==========================================
// SOCKET SETUP
// ==========================================

setupSocket(io);


// ==========================================
// 404 HANDLER
// ==========================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});


// ==========================================
// GLOBAL ERROR HANDLER
// ==========================================

app.use((err, req, res, next) => {

  console.log('SERVER ERROR =>', err);

  res.status(500).json({
    success: false,
    message: 'Internal server error',
  });

});


// ==========================================
// START SERVER
// ==========================================

connectDB()
  .then(() => {

    server.listen(PORT, () => {

      console.log(
        `🚀 DriveEase server running on port ${PORT}`
      );

    });

  })
  .catch((err) => {

    console.log(
      '❌ DB Connection Error:',
      err
    );

  });
