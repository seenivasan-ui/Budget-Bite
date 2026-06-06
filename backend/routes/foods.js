const express = require('express');
const router = express.Router();
const Food = require('../models/Food');
const { protect, adminOnly } = require('../middleware/auth');

// @GET /api/foods - Get all foods
router.get('/', async (req, res) => {
  try {
    const { category, isVeg, trending, limit = 20, page = 1 } = req.query;
    const filter = { isActive: true };
    if (category) filter.category = category;
    if (isVeg !== undefined) filter.isVeg = isVeg === 'true';
    if (trending) filter.isTrending = true;

    const total = await Food.countDocuments(filter);
    const foods = await Food.find(filter)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .sort({ totalOrders: -1 });

    res.json({ success: true, count: foods.length, total, page: Number(page), foods });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @GET /api/foods/categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await Food.distinct('category', { isActive: true });
    res.json({ success: true, categories });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @GET /api/foods/trending
router.get('/trending', async (req, res) => {
  try {
    const foods = await Food.find({ isActive: true, isTrending: true }).limit(8);
    res.json({ success: true, foods });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @GET /api/foods/:slug
router.get('/:slug', async (req, res) => {
  try {
    const food = await Food.findOne({ slug: req.params.slug, isActive: true });
    if (!food) return res.status(404).json({ error: 'Food not found' });
    food.totalOrders += 1;
    await food.save();
    res.json({ success: true, food });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @POST /api/foods - Admin: create food
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const food = await Food.create(req.body);
    res.status(201).json({ success: true, food });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// @PUT /api/foods/:id - Admin: update food
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const food = await Food.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!food) return res.status(404).json({ error: 'Food not found' });
    res.json({ success: true, food });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// @DELETE /api/foods/:id - Admin: soft delete
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Food.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: 'Food deactivated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
