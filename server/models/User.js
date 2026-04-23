const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['guest', 'free', 'premium'], default: 'free' },
  coins: { type: Number, default: 0 },
  streak: { type: Number, default: 0 },
  lastLogin: { type: Date },
  weekStartDate: { type: Date, default: Date.now },
  premiumExpiry: { type: Date },
  premiumSource: { type: String, enum: ['stripe', 'coins', null], default: null },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);