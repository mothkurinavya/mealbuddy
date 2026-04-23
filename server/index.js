const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const recipeRoutes = require('./routes/recipes');
app.use('/api/recipes', recipeRoutes);

const mealPlanRoutes = require('./routes/mealplan');
app.use('/api/mealplan', mealPlanRoutes);

const budgetRoutes = require('./routes/budget');
app.use('/api/budget', budgetRoutes);

const currencyRoutes = require('./routes/currency');
app.use('/api/currency', currencyRoutes);

const startWeeklyReset = require('./jobs/weeklyReset');
startWeeklyReset();

const foodLogRoutes = require('./routes/foodlog');
app.use('/api/foodlog', foodLogRoutes);

const stripeRoutes = require('./routes/stripe');
app.use('/api/stripe', stripeRoutes);

app.get('/', (req, res) => {
  res.send('MealBuddy API is running!');
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.log(err));