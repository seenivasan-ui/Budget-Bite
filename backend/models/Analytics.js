const mongoose = require('mongoose');

const searchLogSchema = new mongoose.Schema({
  user:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  query:     { type: String, required: true },
  results:   { type: Number, default: 0 },
  ipAddress: { type: String },
  city:      { type: String }
}, { timestamps: true });

const budgetPlanSchema = new mongoose.Schema({
  user:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  budget:  { type: Number, required: true },
  items: [{
    food:      { type: mongoose.Schema.Types.ObjectId, ref: 'Food' },
    foodName:  String,
    platform:  String,
    price:     Number,
    coupon:    String,
    saving:    Number
  }],
  totalCost:   { type: Number, required: true },
  totalSaving: { type: Number, default: 0 },
  remaining:   { type: Number, default: 0 },
  savedAt:     { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = {
  SearchLog:  mongoose.model('SearchLog', searchLogSchema),
  BudgetPlan: mongoose.model('BudgetPlan', budgetPlanSchema)
};
