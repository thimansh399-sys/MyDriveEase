const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: 100,
  },
  phone: {
    type: String,
    required: [true, 'Phone is required'],
    unique: true,
    trim: true,
    match: [/^\d{10,15}$/, 'Invalid phone number'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    select: false,
  },
  avatar: {
    type: String,
    default: '',
  },
  aadhaarNumber: {
    type: String,
    default: '',
    trim: true,
  },
  aadhaarImage: {
    type: String,
    default: '',
  },
  kycStatus: {
    type: String,
    enum: ['pending', 'submitted', 'verified', 'rejected'],
    default: 'pending',
  },
  kycNotes: {
    type: String,
    default: '',
    maxlength: 500,
  },
  role: {
    type: String,
    enum: ['user', 'driver', 'admin'],
    default: 'user',
  },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
