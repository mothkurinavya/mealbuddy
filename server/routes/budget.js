const express = require('express');
const router = express.Router();
const Budget = require('../models/Budget');
const auth = require('../middleware/auth');

// Get budget
router.get('/', auth, async (req, res) => {
  try {
    let budget = await Budget.findOne({ user: req.user.id });
    if (!budget) budget = await Budget.create({ user: req.user.id });
    res.json(budget);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Set weekly limit
router.put('/limit', auth, async (req, res) => {
  try {
    const budget = await Budget.findOneAndUpdate(
      { user: req.user.id },
      { weeklyLimit: req.body.weeklyLimit },
      { new: true, upsert: true }
    );
    res.json(budget);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add entry
router.post('/entry', auth, async (req, res) => {
  try {
    const budget = await Budget.findOneAndUpdate(
      { user: req.user.id },
      { $push: { entries: { item: req.body.item, cost: req.body.cost } } },
      { new: true, upsert: true }
    );
    res.json(budget);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete entry
router.delete('/entry/:id', auth, async (req, res) => {
  try {
    const budget = await Budget.findOneAndUpdate(
      { user: req.user.id },
      { $pull: { entries: { _id: req.params.id } } },
      { new: true }
    );
    res.json(budget);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;