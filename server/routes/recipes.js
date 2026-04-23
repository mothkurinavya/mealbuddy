const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/search', async (req, res) => {
  try {
    const { query } = req.query;
    const response = await axios.get(
      `https://api.spoonacular.com/recipes/complexSearch`, {
        params: {
          query: query || 'pasta',
          addRecipeNutrition: true,
          number: 12,
          apiKey: process.env.SPOONACULAR_API_KEY
        }
      }
    );
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;