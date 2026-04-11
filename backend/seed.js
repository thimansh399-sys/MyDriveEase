const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { MONGO_URI } = require('./config');

const User = require('./models/User');
const Driver = require('./models/Driver');

const seed = async () => {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  // Clear existing data
  await User.deleteMany({});
  await Driver.deleteMany({});

  // Create sample users
  await User.create([
    { name: 'Rahul Kumar', phone: '9876543210', password: 'password123', role: 'user' },
    { name: 'Priya Sharma', phone: '9876543211', password: 'password123', role: 'user' },
  ]);

  // Create sample drivers - locations around Delhi
  const driverData = [
    {
      name: 'Amit Singh',
      phone: '9876543220',
      password: await bcrypt.hash('password123', 12),
      vehicle: { type: 'sedan', model: 'Swift Dzire', plate: 'DL 01 AB 1234' },
      status: 'online',
      location: { type: 'Point', coordinates: [77.2090, 28.6139] },
      rating: 4.8,
      totalRides: 120,
      earnings: 45000,
    },
    {
      name: 'Suresh Verma',
      phone: '9876543221',
      password: await bcrypt.hash('password123', 12),
      vehicle: { type: 'suv', model: 'Innova', plate: 'DL 02 CD 5678' },
      status: 'online',
      location: { type: 'Point', coordinates: [77.2190, 28.6239] },
      rating: 4.5,
      totalRides: 85,
      earnings: 32000,
    },
    {
      name: 'Rakesh Yadav',
      phone: '9876543222',
      password: await bcrypt.hash('password123', 12),
      vehicle: { type: 'hatchback', model: 'WagonR', plate: 'DL 03 EF 9012' },
      status: 'offline',
      location: { type: 'Point', coordinates: [77.1990, 28.6039] },
      rating: 4.2,
      totalRides: 200,
      earnings: 67000,
    },
    {
      name: 'Vikram Patel',
      phone: '9876543223',
      password: await bcrypt.hash('password123', 12),
      vehicle: { type: 'auto', model: 'Auto Rickshaw', plate: 'DL 04 GH 3456' },
      status: 'online',
      location: { type: 'Point', coordinates: [77.2290, 28.6339] },
      rating: 4.0,
      totalRides: 350,
      earnings: 89000,
    },
    {
      name: 'Manoj Tiwari',
      phone: '9876543224',
      password: await bcrypt.hash('password123', 12),
      vehicle: { type: 'sedan', model: 'Etios', plate: 'DL 05 IJ 7890' },
      status: 'online',
      location: { type: 'Point', coordinates: [77.2150, 28.6180] },
      rating: 4.9,
      totalRides: 500,
      earnings: 180000,
    },
  ];

  await Driver.insertMany(driverData);

  console.log('Seed data created successfully!');
  console.log('---');
  console.log('Sample User Login: phone=9876543210,  password=password123');
  console.log('Sample Driver Login: phone=9876543220, password=password123');
  console.log('---');

  process.exit(0);
};

seed().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});
