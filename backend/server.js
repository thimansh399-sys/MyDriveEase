const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { Server } = require('socket.io');

const connectDB = require('./config/db');
const ensureAdmin = require('./config/ensureAdmin');
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
const userRoutes = require('./routes/users');
const subscriptionRoutes = require('./routes/subscriptions');
const reviewRoutes = require('./routes/reviews');

// ❌ REMOVE THIS LINE
// const driverAuthRoutes = require('./routes/driverAuth');

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'https://mydriveease.in',
  'https://www.mydriveease.in',
];

const corsOrigin = (origin, callback) => {
  if (
    !origin ||
    allowedOrigins.includes(origin) ||
    /^https:\/\/my-drive-ease-[a-z0-9-]+\.vercel\.app$/i.test(origin)
  ) {
    return callback(null, true);
  }

  return callback(new Error(`CORS blocked origin: ${origin}`));
};


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
    origin: corsOrigin,

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

    credentials: true,
  })
);


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

// USERS
app.use('/api/users', userRoutes);

// SUBSCRIPTIONS
app.use('/api/subscriptions', subscriptionRoutes);

// REVIEWS
app.use('/api/reviews', reviewRoutes);




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
  .then(async () => {

    await ensureAdmin();

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
