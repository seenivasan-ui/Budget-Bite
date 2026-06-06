const express = require('express');
const router = express.Router();
const FoodItem = require('../models/FoodItem');
const { protect } = require('../middleware/auth');

// GET /api/food/search?q=butter+chicken
router.get('/search', async (req, res) => {
  try {
    const { q, category, isVeg } = req.query;
    const filter = {};
    if (q) filter.name = { $regex: q, $options: 'i' };
    if (category) filter.category = category;
    if (isVeg !== undefined) filter.isVeg = isVeg === 'true';

    const items = await FoodItem.find(filter);

    // Track search count
    if (q) {
      await FoodItem.updateMany(
        { name: { $regex: q, $options: 'i' } },
        { $inc: { searchCount: 1 } }
      );
    }

    // Sort platforms by price for each item
    const result = items.map(item => ({
      ...item._doc,
      platforms: [...item.platforms].sort((a, b) => a.price - b.price)
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/food/popular
router.get('/popular', async (req, res) => {
  try {
    const items = await FoodItem.find().sort({ searchCount: -1 }).limit(8);
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/food/categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await FoodItem.distinct('category');
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/food/:id
router.get('/:id', async (req, res) => {
  try {
    const item = await FoodItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Food item not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
