const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Food = require('../models/Food');
const { protect } = require('../middleware/auth');

// @GET /api/wishlist
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist');
    res.json({ success: true, wishlist: user.wishlist });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @POST /api/wishlist/:foodId - Toggle wishlist
router.post('/:foodId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const foodId = req.params.foodId;
    const idx = user.wishlist.indexOf(foodId);

    if (idx === -1) {
      user.wishlist.push(foodId);
      await user.save();
      return res.json({ success: true, action: 'added', message: 'Added to wishlist' });
    } else {
      user.wishlist.splice(idx, 1);
      await user.save();
      return res.json({ success: true, action: 'removed', message: 'Removed from wishlist' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
