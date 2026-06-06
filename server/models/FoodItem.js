const mongoose = require('mongoose');

const platformPriceSchema = new mongoose.Schema({
  platform: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number, required: true },
  coupon: { type: String, default: null },
  couponDiscount: { type: Number, default: 0 },
  restaurant: { type: String, required: true },
  rating: { type: Number, default: 4.0 },
  deliveryTime: { type: String, default: '30 min' },
  available: { type: Boolean, default: true }
});

const foodItemSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  category: {
    type: String,
    enum: ['North Indian', 'South Indian', 'Chinese', 'Fast Food', 'Pizza', 'Biryani', 'Desserts', 'Beverages'],
    required: true
  },
  emoji: { type: String, default: '🍽' },
  isVeg: { type: Boolean, default: false },
  platforms: [platformPriceSchema],
  tags: [String],
  searchCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('FoodItem', foodItemSchema);
