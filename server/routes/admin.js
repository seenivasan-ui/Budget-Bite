const express = require('express');
const router = express.Router();
const User = require('../models/User');
const FoodItem = require('../models/FoodItem');
const SavedCombo = require('../models/SavedCombo');
const { protect, adminOnly } = require('../middleware/auth');

// All admin routes are protected
router.use(protect, adminOnly);

// GET /api/admin/stats
router.get('/stats', async (req, res) => {
  try {
    const [totalUsers, totalFoods, totalCombos, recentUsers] = await Promise.all([
      User.countDocuments(),
      FoodItem.countDocuments(),
      SavedCombo.countDocuments(),
      User.find().sort({ createdAt: -1 }).limit(5).select('-password')
    ]);

    const topSearched = await FoodItem.find().sort({ searchCount: -1 }).limit(5);

    res.json({ totalUsers, totalFoods, totalCombos, recentUsers, topSearched });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/admin/users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/admin/users/:id
router.delete('/users/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/admin/users/:id/role
router.put('/users/:id/role', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true }).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/admin/foods
router.get('/foods', async (req, res) => {
  try {
    const foods = await FoodItem.find().sort({ searchCount: -1 });
    res.json(foods);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/admin/foods
router.post('/foods', async (req, res) => {
  try {
    const food = await FoodItem.create(req.body);
    res.status(201).json(food);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/admin/foods/:id
router.put('/foods/:id', async (req, res) => {
  try {
    const food = await FoodItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(food);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/admin/foods/:id
router.delete('/foods/:id', async (req, res) => {
  try {
    await FoodItem.findByIdAndDelete(req.params.id);
    res.json({ message: 'Food item deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/admin/seed  — seed sample data
router.post('/seed', async (req, res) => {
  try {
    await FoodItem.deleteMany({});
    const sampleFoods = [
      {
        name: 'Butter Chicken', category: 'North Indian', emoji: '🍛', isVeg: false,
        tags: ['popular', 'spicy'],
        platforms: [
          { platform: 'Swiggy', price: 189, originalPrice: 220, coupon: 'SAVE30', couponDiscount: 31, restaurant: 'Spice Garden', rating: 4.3, deliveryTime: '30 min' },
          { platform: 'Zomato', price: 175, originalPrice: 210, coupon: 'ZOM20', couponDiscount: 35, restaurant: 'Royal Kitchen', rating: 4.5, deliveryTime: '25 min' },
          { platform: 'Magicpin', price: 199, originalPrice: 199, coupon: null, couponDiscount: 0, restaurant: 'Curry House', rating: 4.1, deliveryTime: '35 min' },
        ]
      },
      {
        name: 'Margherita Pizza', category: 'Pizza', emoji: '🍕', isVeg: true,
        tags: ['cheesy', 'popular'],
        platforms: [
          { platform: 'Swiggy', price: 149, originalPrice: 180, coupon: 'PIZZA20', couponDiscount: 31, restaurant: 'Pizza Roma', rating: 4.2, deliveryTime: '40 min' },
          { platform: 'Zomato', price: 159, originalPrice: 190, coupon: 'FLAT30', couponDiscount: 31, restaurant: 'Slice & Co', rating: 4.4, deliveryTime: '35 min' },
          { platform: 'EatSure', price: 145, originalPrice: 175, coupon: 'NEW15', couponDiscount: 30, restaurant: 'Urban Pizza', rating: 4.0, deliveryTime: '45 min' },
        ]
      },
      {
        name: 'Chicken Biryani', category: 'Biryani', emoji: '🍚', isVeg: false,
        tags: ['bestseller', 'dum'],
        platforms: [
          { platform: 'Swiggy', price: 249, originalPrice: 280, coupon: 'BIRI30', couponDiscount: 31, restaurant: 'Dum Biryani', rating: 4.6, deliveryTime: '45 min' },
          { platform: 'Zomato', price: 229, originalPrice: 270, coupon: 'ZOM40', couponDiscount: 41, restaurant: "Nawab's", rating: 4.7, deliveryTime: '40 min' },
          { platform: 'Dunzo', price: 259, originalPrice: 290, coupon: 'D20', couponDiscount: 31, restaurant: 'Biryani Bowl', rating: 4.2, deliveryTime: '50 min' },
        ]
      },
      {
        name: 'Veg Burger', category: 'Fast Food', emoji: '🍔', isVeg: true,
        tags: ['snack', 'quick'],
        platforms: [
          { platform: 'Swiggy', price: 99, originalPrice: 120, coupon: 'BURGER25', couponDiscount: 21, restaurant: 'BurgerBox', rating: 4.0, deliveryTime: '20 min' },
          { platform: 'Zomato', price: 89, originalPrice: 110, coupon: 'ZOM20', couponDiscount: 21, restaurant: 'Grill Nation', rating: 4.2, deliveryTime: '25 min' },
          { platform: 'Magicpin', price: 109, originalPrice: 130, coupon: 'MP10', couponDiscount: 21, restaurant: 'Stack House', rating: 3.9, deliveryTime: '30 min' },
        ]
      },
      {
        name: 'Masala Dosa', category: 'South Indian', emoji: '🫓', isVeg: true,
        tags: ['breakfast', 'crispy'],
        platforms: [
          { platform: 'Swiggy', price: 79, originalPrice: 95, coupon: 'SOUTH15', couponDiscount: 16, restaurant: 'Udupi Palace', rating: 4.4, deliveryTime: '25 min' },
          { platform: 'Zomato', price: 69, originalPrice: 85, coupon: 'ZOM15', couponDiscount: 16, restaurant: 'MTR Express', rating: 4.6, deliveryTime: '20 min' },
          { platform: 'Magicpin', price: 85, originalPrice: 100, coupon: 'MP10', couponDiscount: 15, restaurant: 'Saravana Bhavan', rating: 4.2, deliveryTime: '30 min' },
        ]
      },
      {
        name: 'Paneer Tikka', category: 'North Indian', emoji: '🧆', isVeg: true,
        tags: ['starter', 'grilled'],
        platforms: [
          { platform: 'Swiggy', price: 169, originalPrice: 200, coupon: 'PANEER20', couponDiscount: 31, restaurant: 'Tandoor Tales', rating: 4.3, deliveryTime: '35 min' },
          { platform: 'Zomato', price: 155, originalPrice: 190, coupon: 'ZOM35', couponDiscount: 35, restaurant: 'Grill & Spice', rating: 4.5, deliveryTime: '30 min' },
          { platform: 'EatSure', price: 179, originalPrice: 210, coupon: null, couponDiscount: 0, restaurant: 'Punjabi Tadka', rating: 4.1, deliveryTime: '40 min' },
        ]
      },
      {
        name: 'Fried Rice', category: 'Chinese', emoji: '🍱', isVeg: false,
        tags: ['chinese', 'filling'],
        platforms: [
          { platform: 'Swiggy', price: 129, originalPrice: 150, coupon: 'CHINA15', couponDiscount: 21, restaurant: 'Wok & Roll', rating: 4.1, deliveryTime: '30 min' },
          { platform: 'Zomato', price: 119, originalPrice: 145, coupon: 'ZOM25', couponDiscount: 26, restaurant: 'Dragon Palace', rating: 4.3, deliveryTime: '25 min' },
        ]
      },
      {
        name: 'Chocolate Brownie', category: 'Desserts', emoji: '🍫', isVeg: true,
        tags: ['sweet', 'dessert'],
        platforms: [
          { platform: 'Swiggy', price: 69, originalPrice: 80, coupon: null, couponDiscount: 0, restaurant: 'Sweet Spot', rating: 4.5, deliveryTime: '20 min' },
          { platform: 'Zomato', price: 59, originalPrice: 75, coupon: 'ZOM15', couponDiscount: 16, restaurant: 'Dessert Lab', rating: 4.6, deliveryTime: '25 min' },
        ]
      }
    ];
    await FoodItem.insertMany(sampleFoods);
    res.json({ message: `Seeded ${sampleFoods.length} food items successfully` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
