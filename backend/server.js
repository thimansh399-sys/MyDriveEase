const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { Server } = require('socket.io');

const connectDB = require('./config/db');
const { PORT } = require('./config');
const setupSocket = require('./socket');

const authRoutes = require('./routes/auth');
const driverRoutes = require('./routes/drivers');
const bookingRoutes = require('./routes/bookings');

const app = express();
const server = http.createServer(app);


// ✅ SOCKET.IO
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.set('io', io);


// ✅ SECURITY
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);


// ✅ CORS FIX
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// ✅ PREFLIGHT FIX
app.options("*", cors());


// ✅ BODY PARSER
app.use(express.json({ limit: '10kb' }));


// ✅ RATE LIMITER
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: {
    message: 'Too many requests, please try again later',
  },
});

app.use('/api/', limiter);


// ✅ ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/drivers', require('./routes/drivers'));


// ✅ HEALTH CHECK
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});


// ✅ SOCKET SETUP
setupSocket(io);


// ✅ START SERVER
connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`🚀 DriveEase server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log('❌ DB Connection Error:', err);
  });