const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Food = require('../models/Food');
const { SearchLog, BudgetPlan } = require('../models/Analytics');
const { protect, adminOnly } = require('../middleware/auth');

router.use(protect, adminOnly);

// @GET /api/admin/stats
router.get('/stats', async (req, res) => {
  try {
    const [totalUsers, totalFoods, totalSearches, totalPlans, recentSearches] = await Promise.all([
      User.countDocuments(),
      Food.countDocuments({ isActive: true }),
      SearchLog.countDocuments(),
      BudgetPlan.countDocuments(),
      SearchLog.find().sort({ createdAt: -1 }).limit(10).populate('user', 'name email')
    ]);

    // Top searched queries
    const topSearches = await SearchLog.aggregate([
      { $group: { _id: '$query', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Searches per day (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const searchesByDay = await SearchLog.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      { $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        count: { $sum: 1 }
      }},
      { $sort: { _id: 1 } }
    ]);

    // Most viewed foods
    const topFoods = await Food.find({ isActive: true })
      .sort({ totalOrders: -1 }).limit(5).select('name emoji totalOrders category');

    // New users last 7 days
    const newUsers = await User.countDocuments({ createdAt: { $gte: sevenDaysAgo } });

    res.json({
      success: true,
      stats: { totalUsers, totalFoods, totalSearches, totalPlans, newUsers },
      topSearches, searchesByDay, topFoods, recentSearches
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @GET /api/admin/users
router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const filter = {};
    if (search) filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ];
    const [users, total] = await Promise.all([
      User.find(filter).sort({ createdAt: -1 })
        .limit(Number(limit)).skip((Number(page) - 1) * Number(limit)),
      User.countDocuments(filter)
    ]);
    res.json({ success: true, users, total, page: Number(page) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @PUT /api/admin/users/:id/toggle - Activate/deactivate user
router.put('/users/:id/toggle', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.role === 'admin') return res.status(400).json({ error: 'Cannot deactivate admin' });
    user.isActive = !user.isActive;
    await user.save();
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @PUT /api/admin/users/:id/role
router.put('/users/:id/role', async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @DELETE /api/admin/search-logs - Clear old logs
router.delete('/search-logs', async (req, res) => {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const result = await SearchLog.deleteMany({ createdAt: { $lt: thirtyDaysAgo } });
    res.json({ success: true, deleted: result.deletedCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
