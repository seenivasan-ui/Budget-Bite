const express = require('express');
const router = express.Router();
const FoodItem = require('../models/FoodItem');
const SavedCombo = require('../models/SavedCombo');
const { protect } = require('../middleware/auth');

// POST /api/budget/optimize
router.post('/optimize', async (req, res) => {
  try {
    const { budget, category, isVeg } = req.body;
    if (!budget || budget < 50)
      return res.status(400).json({ message: 'Budget must be at least ₹50' });

    const filter = { 'platforms.0': { $exists: true } };
    if (category) filter.category = category;
    if (isVeg !== undefined) filter.isVeg = isVeg;

    const allItems = await FoodItem.find(filter);

    // For each food item, get the cheapest platform option
    const options = allItems.map(item => {
      const cheapest = [...item.platforms]
        .filter(p => p.available)
        .sort((a, b) => a.price - b.price)[0];
      if (!cheapest) return null;
      return {
        foodId: item._id,
        foodName: item.name,
        emoji: item.emoji,
        category: item.category,
        isVeg: item.isVeg,
        platform: cheapest.platform,
        restaurant: cheapest.restaurant,
        price: cheapest.price,
        originalPrice: cheapest.originalPrice,
        coupon: cheapest.coupon,
        couponDiscount: cheapest.couponDiscount,
        rating: cheapest.rating,
        valueScore: cheapest.rating / cheapest.price
      };
    }).filter(Boolean);

    // Knapsack greedy by value score (rating/price ratio)
    options.sort((a, b) => b.valueScore - a.valueScore);

    const selected = [];
    let remaining = budget;

    for (const option of options) {
      if (option.price <= remaining) {
        selected.push(option);
        remaining -= option.price;
        if (remaining < 60) break;
      }
    }

    const totalCost = selected.reduce((s, i) => s + i.price, 0);
    const totalOriginal = selected.reduce((s, i) => s + i.originalPrice, 0);
    const totalSaved = totalOriginal - totalCost;

    res.json({
      budget,
      items: selected,
      totalCost,
      totalSaved,
      remaining: budget - totalCost,
      itemCount: selected.length
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/budget/save  (auth required)
router.post('/save', protect, async (req, res) => {
  try {
    const { name, budget, items, totalCost, totalSaved } = req.body;
    const combo = await SavedCombo.create({
      user: req.user._id, name, budget, items, totalCost, totalSaved
    });
    res.status(201).json(combo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/budget/saved  (auth required)
router.get('/saved', protect, async (req, res) => {
  try {
    const combos = await SavedCombo.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(combos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/budget/saved/:id
router.delete('/saved/:id', protect, async (req, res) => {
  try {
    const combo = await SavedCombo.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!combo) return res.status(404).json({ message: 'Combo not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
