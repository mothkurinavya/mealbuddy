const cron = require('node-cron');
const User = require('../models/User');
const MealPlan = require('../models/MealPlan');
const Budget = require('../models/Budget');

const startWeeklyReset = () => {
  // Runs every day at midnight
  cron.schedule('0 0 * * *', async () => {
    console.log('Running weekly reset cron job...');
    try {
      const now = new Date();
      const users = await User.find({});

      for (const user of users) {
        const weekStart = new Date(user.weekStartDate);
        const diffDays = Math.floor((now - weekStart) / (1000 * 60 * 60 * 24));

        // Reset meal plan and budget every 7 days
        if (diffDays >= 7) {
          await MealPlan.deleteMany({ user: user._id });
          await Budget.findOneAndUpdate(
            { user: user._id },
            { entries: [], weekStartDate: now },
            { new: true }
          );
          await User.findByIdAndUpdate(user._id, { weekStartDate: now });
          console.log(`Reset done for user: ${user.email}`);
        }

        // Check premium expiry
        if (user.premiumExpiry && new Date(user.premiumExpiry) < now) {
          await User.findByIdAndUpdate(user._id, {
            role: 'free',
            premiumExpiry: null,
            premiumSource: null
          });
          console.log(`Premium expired for: ${user.email}`);
        }
      }
    } catch (err) {
      console.error('Cron error:', err);
    }
  });
  console.log('Weekly reset cron job scheduled!');
};

module.exports = startWeeklyReset;