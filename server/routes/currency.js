const express = require('express');
const router = express.Router();
const axios = require('axios');

let cache = {};
let cacheTime = {};

// Convert specific pair
router.get('/pair/:base/:target', async (req, res) => {
  try {
    const { base, target } = req.params;
    const response = await axios.get(
      `https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_RATE_API_KEY}/pair/${base}/${target}`
    );
    res.json({ rate: response.data.conversion_rate });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all rates for base currency (cached 1 hour)
router.get('/latest/:base', async (req, res) => {
  try {
    const { base } = req.params;
    const now = Date.now();
    if (cache[base] && now - cacheTime[base] < 3600000) {
      return res.json(cache[base]);
    }
    const response = await axios.get(
      `https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_RATE_API_KEY}/latest/${base}`
    );
    cache[base] = response.data;
    cacheTime[base] = now;
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;