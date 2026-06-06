const express = require('express');
const router = express.Router();
const Food = require('../models/Food');
const { BudgetPlan } = require('../models/Analytics');
const { protect } = require('../middleware/auth');

// Smart budget optimizer using value-based knapsack
function optimizeBudget(foods, budget) {
  const items = [];

  foods.forEach(food => {
    const cheapestPlatform = food.platforms
      .filter(p => p.inStock && p.price <= budget)
      .sort((a, b) => a.price - b.price)[0];

    if (cheapestPlatform) {
      const saving = cheapestPlatform.originalPrice - cheapestPlatform.price;
      const value = (food.avgRating || 4) * (1 + saving / cheapestPlatform.price);
      items.push({
        foodId: food._id,
        foodName: food.name,
        emoji: food.emoji,
        category: food.category,
        isVeg: food.isVeg,
        platform: cheapestPlatform.platform,
        restaurant: cheapestPlatform.restaurant,
        price: cheapestPlatform.price,
        originalPrice: cheapestPlatform.originalPrice,
        coupon: cheapestPlatform.coupon,
        couponDiscount: cheapestPlatform.couponDiscount,
        deliveryTime: cheapestPlatform.deliveryTime,
        saving,
        value
      });
    }
  });

  // Greedy by value/price ratio
  items.sort((a, b) => (b.value / b.price) - (a.value / a.price));

  const selected = [];
  let remaining = budget;

  for (const item of items) {
    if (item.price <= remaining) {
      selected.push(item);
      remaining -= item.price;
      if (remaining < 50) break;
    }
  }

  const totalCost = selected.reduce((s, i) => s + i.price, 0);
  const totalSaving = selected.reduce((s, i) => s + i.saving, 0);

  return { items: selected, totalCost, totalSaving, remaining: budget - totalCost };
}

// @POST /api/budget/optimize
router.post('/optimize', async (req, res) => {
  try {
    const { budget, category, isVeg } = req.body;
    if (!budget || budget < 50)
      return res.status(400).json({ error: 'Budget must be at least ₹50' });

    const filter = { isActive: true, 'platforms.inStock': true };
    if (category) filter.category = category;
    if (isVeg !== undefined) filter.isVeg = isVeg;

    const foods = await Food.find(filter);
    const result = optimizeBudget(foods, budget);

    res.json({ success: true, budget, ...result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @POST /api/budget/save - Save a budget plan (auth required)
router.post('/save', protect, async (req, res) => {
  try {
    const { budget, items, totalCost, totalSaving, remaining } = req.body;
    const plan = await BudgetPlan.create({
      user: req.user._id,
      budget, items, totalCost, totalSaving, remaining
    });
    res.status(201).json({ success: true, plan });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @GET /api/budget/history - Get user's saved plans
router.get('/history', protect, async (req, res) => {
  try {
    const plans = await BudgetPlan.find({ user: req.user._id })
      .sort({ createdAt: -1 }).limit(10);
    res.json({ success: true, plans });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
