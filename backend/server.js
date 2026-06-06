const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests, please try again later.' }
});

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(morgan('dev'));
app.use('/api', limiter);

// Routes
app.use('/api/auth',    require('./routes/auth'));
app.use('/api/foods',   require('./routes/foods'));
app.use('/api/search',  require('./routes/search'));
app.use('/api/budget',  require('./routes/budget'));
app.use('/api/admin',   require('./routes/admin'));
app.use('/api/wishlist',require('./routes/wishlist'));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'OK', message: 'BudgetBite API running' }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

// Connect DB & start
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(process.env.PORT || 5000, () =>
      console.log(`🚀 Server running on port ${process.env.PORT || 5000}`)
    );
  })
  .catch(err => { console.error('❌ MongoDB error:', err); process.exit(1); });
