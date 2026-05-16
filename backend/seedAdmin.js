const mongoose = require('mongoose');

const { MONGO_URI } = require('./config');
const User = require('./models/User');

const requiredEnv = ['ADMIN_NAME', 'ADMIN_PHONE', 'ADMIN_PASSWORD'];
const missingEnv = requiredEnv.filter((key) => !process.env[key]);

if (missingEnv.length) {
  console.error(`Missing required env: ${missingEnv.join(', ')}`);
  console.error('Example: ADMIN_NAME="Owner" ADMIN_PHONE="9876543210" ADMIN_PASSWORD="strong-password" npm run seed:admin');
  process.exit(1);
}

const admin = {
  name: process.env.ADMIN_NAME,
  phone: process.env.ADMIN_PHONE,
  password: process.env.ADMIN_PASSWORD,
  role: 'admin',
};

const seedAdmin = async () => {
  await mongoose.connect(MONGO_URI);

  const existingAdmin = await User.findOne({ phone: admin.phone });

  if (existingAdmin) {
    existingAdmin.name = admin.name;
    existingAdmin.role = 'admin';
    existingAdmin.password = admin.password;

    await existingAdmin.save();
    console.log(`Admin updated: phone=${admin.phone}`);
  } else {
    await User.create(admin);
    console.log(`Admin created: phone=${admin.phone}`);
  }

  console.log(`Admin login phone: ${admin.phone}`);
  await mongoose.disconnect();
};

seedAdmin().catch(async (err) => {
  console.error('Admin seed error:', err);
  await mongoose.disconnect();
  process.exit(1);
});
