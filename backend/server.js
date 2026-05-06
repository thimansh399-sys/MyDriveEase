const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const { PORT, CLIENT_URL } = require('./config');
const setupSocket = require('./socket');

const authRoutes = require('./routes/auth');
const driverRoutes = require('./routes/drivers');
const bookingRoutes = require('./routes/bookings');

const app = express();
const server = http.createServer(app);

// ✅ Allowed Origins
const allowedOrigins = [
  CLIENT_URL,
  'https://www.mydriveease.in',
  'https://mydriveease.in'
];

// ✅ Socket.IO
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true
  },
});

app.set('io', io);

// ✅ Middleware
app.use(helmet({ contentSecurityPolicy: false }));

// 🔥 FIXED CORS (Main Fix)
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true); // ⚡ block mat karo (important)
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// 🔥 VERY IMPORTANT (Preflight Fix)
app.options('*', cors());

app.use(express.json({ limit: '10kb' }));

// ✅ Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { message: 'Too many requests, please try again later' },
});
app.use('/api/', limiter);

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/bookings', bookingRoutes);

// ✅ Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ✅ Socket Setup
setupSocket(io);

// ✅ DB + Server Start
connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`DriveEase server running on port ${PORT}`);
  });
});