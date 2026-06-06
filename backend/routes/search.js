const express = require('express');
const router = express.Router();
const Food = require('../models/Food');
const { SearchLog } = require('../models/Analytics');
const { optionalAuth } = require('../middleware/auth');

// @GET /api/search?q=burger&maxPrice=200
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { q, maxPrice, category, isVeg, platform, sortBy = 'price' } = req.query;
    if (!q) return res.status(400).json({ error: 'Search query required' });

    const filter = { isActive: true, $text: { $search: q } };
    if (category) filter.category = category;
    if (isVeg !== undefined) filter.isVeg = isVeg === 'true';

    let foods = await Food.find(filter, { score: { $meta: 'textScore' } })
      .sort({ score: { $meta: 'textScore' } })
      .limit(30);

    // Filter by max price across platforms
    if (maxPrice) {
      foods = foods.filter(f =>
        f.platforms.some(p => p.inStock && p.price <= Number(maxPrice))
      );
    }

    // Filter by specific platform
    if (platform) {
      foods = foods.map(f => ({
        ...f.toJSON(),
        platforms: f.platforms.filter(p =>
          p.platform.toLowerCase() === platform.toLowerCase()
        )
      })).filter(f => f.platforms.length > 0);
    }

    // Sort platform prices within each food
    foods = foods.map(f => {
      const foodObj = f.toJSON ? f.toJSON() : f;
      const sortedPlatforms = [...foodObj.platforms].sort((a, b) => a.price - b.price);
      return { ...foodObj, platforms: sortedPlatforms };
    });

    // Log search
    await SearchLog.create({
      user: req.user?._id || null,
      query: q,
      results: foods.length,
      ipAddress: req.ip
    });

    // Save to user search history
    if (req.user) {
      await req.user.updateOne({
        $push: {
          searchHistory: {
            $each: [{ query: q }],
            $slice: -20
          }
        }
      });
    }

    res.json({ success: true, count: foods.length, query: q, results: foods });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @GET /api/search/suggestions?q=but
router.get('/suggestions', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.length < 2) return res.json({ suggestions: [] });

    const foods = await Food.find(
      { name: { $regex: q, $options: 'i' }, isActive: true },
      { name: 1, emoji: 1, category: 1, slug: 1 }
    ).limit(8);

    res.json({ suggestions: foods });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
