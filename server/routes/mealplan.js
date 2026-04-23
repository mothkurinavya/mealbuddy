const express = require('express');
const router = express.Router();
const MealPlan = require('../models/MealPlan');
const auth = require('../middleware/auth');

// Get user's meal plan
router.get('/', auth, async (req, res) => {
  try {
    const meals = await MealPlan.find({ user: req.user.id });
    res.json(meals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add meal to plan
router.post('/', auth, async (req, res) => {
  try {
    const { day, recipeId, title, image, pricePerServing, nutrition } = req.body;
    const meal = new MealPlan({ user: req.user.id, day, recipeId, title, image, pricePerServing, nutrition });
    await meal.save();
    res.json(meal);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete meal from plan
router.delete('/:id', auth, async (req, res) => {
  try {
    await MealPlan.findByIdAndDelete(req.params.id);
    res.json({ message: 'Meal removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;