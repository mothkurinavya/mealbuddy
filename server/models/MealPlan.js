const mongoose = require('mongoose');

const MealPlanSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  day: { type: String, enum: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'], required: true },
  recipeId: { type: Number, required: true },
  title: { type: String, required: true },
  image: { type: String },
  pricePerServing: { type: Number },
  nutrition: { type: Object },
}, { timestamps: true });

module.exports = mongoose.model('MealPlan', MealPlanSchema);