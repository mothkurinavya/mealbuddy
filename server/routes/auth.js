const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });
    const hashed = await bcrypt.hash(password, 10);
    user = new User({ name, email, password: hashed });
    await user.save();
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role, coins: user.coins, streak: user.streak } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const now = new Date();
    const lastLogin = user.lastLogin ? new Date(user.lastLogin) : null;
    let coinsEarned = 0;
    let newStreak = user.streak;

    if (lastLogin) {
      const diffDays = Math.floor((now - lastLogin) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        newStreak = user.streak + 1;
        coinsEarned = 5;
      } else if (diffDays > 1) {
        newStreak = 1;
        coinsEarned = 5;
      }
    } else {
      newStreak = 1;
      coinsEarned = 5;
    }

    let newCoins = user.coins + coinsEarned;
    let newRole = user.role;
    let premiumExpiry = user.premiumExpiry;
    let premiumSource = user.premiumSource;

    if (newStreak >= 30 && user.role === 'free') {
      newRole = 'premium';
      premiumExpiry = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      premiumSource = 'coins';
    }

    if (newCoins >= 200 && user.role === 'free') {
      newRole = 'premium';
      premiumExpiry = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
      premiumSource = 'coins';
      newCoins = 0;
    }

    user.lastLogin = now;
    user.streak = newStreak;
    user.coins = newCoins;
    user.role = newRole;
    user.premiumExpiry = premiumExpiry;
    user.premiumSource = premiumSource;
    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, coins: user.coins, streak: user.streak },
      coinsEarned
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Temp upgrade route for testing
router.put('/upgrade', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOneAndUpdate(
      { email },
      { role: 'premium' },
      { new: true }
    );
    res.json({ message: 'Upgraded!', role: user.role });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// Update profile
const authMiddleware = require('../middleware/auth');
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name: req.body.name },
      { new: true }
    );
    res.json({ message: 'Profile updated', user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// Temp downgrade route for testing
router.put('/downgrade', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOneAndUpdate(
      { email },
      { role: 'free' },
      { new: true }
    );
    res.json({ message: 'Downgraded!', role: user.role });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;