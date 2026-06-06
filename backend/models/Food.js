const mongoose = require('mongoose');

const platformPriceSchema = new mongoose.Schema({
  platform:        { type: String, required: true },
  price:           { type: Number, required: true },
  originalPrice:   { type: Number, required: true },
  coupon:          { type: String, default: null },
  couponDiscount:  { type: Number, default: 0 },
  couponType:      { type: String, enum: ['flat', 'percent', null], default: null },
  restaurant:      { type: String, required: true },
  rating:          { type: Number, default: 4.0 },
  deliveryTime:    { type: String, default: '30 min' },
  deliveryFee:     { type: Number, default: 30 },
  platformUrl:     { type: String, default: '#' },
  inStock:         { type: Boolean, default: true }
}, { _id: false });

const foodSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  slug:        { type: String, required: true, unique: true, lowercase: true },
  category:    { type: String, required: true, enum: ['North Indian','South Indian','Chinese','Italian','Fast Food','Beverages','Desserts','Biryani','Snacks'] },
  emoji:       { type: String, default: '🍽️' },
  description: { type: String, default: '' },
  isVeg:       { type: Boolean, default: true },
  tags:        [String],
  platforms:   [platformPriceSchema],
  avgRating:   { type: Number, default: 0 },
  totalOrders: { type: Number, default: 0 },
  isTrending:  { type: Boolean, default: false },
  isActive:    { type: Boolean, default: true }
}, { timestamps: true });

// Virtual: cheapest price
foodSchema.virtual('cheapestPrice').get(function() {
  if (!this.platforms?.length) return null;
  return Math.min(...this.platforms.filter(p => p.inStock).map(p => p.price));
});

// Virtual: best deal (highest saving)
foodSchema.virtual('bestDeal').get(function() {
  if (!this.platforms?.length) return null;
  return this.platforms.reduce((best, p) => {
    const saving = p.originalPrice - p.price;
    return saving > (best?.originalPrice - best?.price || 0) ? p : best;
  }, null);
});

foodSchema.set('toJSON', { virtuals: true });
foodSchema.set('toObject', { virtuals: true });

foodSchema.index({ name: 'text', tags: 'text', category: 'text' });
foodSchema.index({ category: 1 });
foodSchema.index({ 'platforms.price': 1 });

module.exports = mongoose.model('Food', foodSchema);
