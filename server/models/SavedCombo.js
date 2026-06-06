const mongoose = require('mongoose');

const savedComboSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  budget: { type: Number, required: true },
  items: [{
    foodName: String,
    platform: String,
    restaurant: String,
    price: Number,
    coupon: String,
    couponDiscount: Number,
    emoji: String
  }],
  totalCost: { type: Number, required: true },
  totalSaved: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SavedCombo', savedComboSchema);
