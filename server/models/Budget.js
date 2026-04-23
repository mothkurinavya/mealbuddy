const mongoose = require('mongoose');

const BudgetSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  weeklyLimit: { type: Number, default: 0 },
  entries: [{
    item: { type: String, required: true },
    cost: { type: Number, required: true },
    date: { type: Date, default: Date.now }
  }],
  weekStartDate: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Budget', BudgetSchema);