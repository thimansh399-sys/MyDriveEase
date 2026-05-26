const User = require('../models/User');

const ensureAdmin = async () => {
  const { ADMIN_NAME, ADMIN_PHONE, ADMIN_PASSWORD } = process.env;

  if (!ADMIN_PHONE || !ADMIN_PASSWORD) {
    return;
  }

  const adminName = ADMIN_NAME || 'DriveEase Admin';
  const existingAdmin = await User.findOne({ phone: ADMIN_PHONE }).select('+password');

  if (existingAdmin) {
    existingAdmin.name = adminName;
    existingAdmin.role = 'admin';

    if (process.env.ADMIN_RESET_PASSWORD === 'true') {
      existingAdmin.password = ADMIN_PASSWORD;
    }

    await existingAdmin.save();
    console.log(`Admin ready: phone=${ADMIN_PHONE}`);
    return;
  }

  await User.create({
    name: adminName,
    phone: ADMIN_PHONE,
    password: ADMIN_PASSWORD,
    role: 'admin',
  });

  console.log(`Admin created: phone=${ADMIN_PHONE}`);
};

module.exports = ensureAdmin;
