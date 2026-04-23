const express = require('express');
const router = express.Router();
const axios = require('axios');
const auth = require('../middleware/auth');
const User = require('../models/User');

// Search food
router.get('/search', auth, async (req, res) => {
  try {
    const { query } = req.query;
    const response = await axios.get(
      `https://api.nal.usda.gov/fdc/v1/foods/search`, {
        params: {
          query,
          pageSize: 5,
          api_key: process.env.USDA_API_KEY
        }
      }
    );
    const foods = response.data.foods.map(food => ({
      id: food.fdcId,
      name: food.description,
      calories: food.foodNutrients?.find(n => n.nutrientName === 'Energy')?.value || 0,
      protein: food.foodNutrients?.find(n => n.nutrientName === 'Protein')?.value || 0,
      carbs: food.foodNutrients?.find(n => n.nutrientName === 'Carbohydrate, by difference')?.value || 0,
      fat: food.foodNutrients?.find(n => n.nutrientName === 'Total lipid (fat)')?.value || 0,
    }));
    res.json(foods);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;