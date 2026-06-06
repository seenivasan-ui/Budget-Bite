# 🍽 BudgetBite — MERN Stack Food Price Aggregator

> Compare food prices across Swiggy, Zomato, Magicpin & more. Get the best deal with auto-applied coupons, and plan meals within your budget automatically.

---

## 🚀 Features

| Feature | Description |
|---|---|
| 🔍 **Price Comparison** | Search any dish, see prices from all platforms side-by-side |
| 🏷 **Auto Coupons** | Best available coupon shown & applied automatically |
| 🎯 **Budget Planner** | Enter budget → get optimal meal combo using smart algorithm |
| 👤 **Auth (JWT)** | Register, login, profile, change password |
| ❤️ **Wishlist** | Save favourite dishes |
| 📊 **Admin Dashboard** | Stats, charts, search analytics, user management, food CRUD |
| 📱 **Responsive** | Works on mobile, tablet, desktop |

---

## 🛠 Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18, React Router v6, Recharts, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| Validation | express-validator |

---

## 📁 Project Structure

```
budgetbite/
├── backend/
│   ├── models/
│   │   ├── User.js          # User schema (bcrypt password)
│   │   ├── Food.js          # Food + platform prices schema
│   │   └── Analytics.js     # SearchLog + BudgetPlan schemas
│   ├── routes/
│   │   ├── auth.js          # /register /login /me /profile
│   │   ├── foods.js         # CRUD for food items
│   │   ├── search.js        # Full-text search + suggestions
│   │   ├── budget.js        # Budget optimizer API
│   │   ├── wishlist.js      # Toggle wishlist
│   │   └── admin.js         # Admin stats, users, food management
│   ├── middleware/
│   │   └── auth.js          # protect, adminOnly, optionalAuth
│   ├── server.js            # Express app entry point
│   ├── seed.js              # Seed DB with sample data
│   └── .env.example
│
└── frontend/
    └── src/
        ├── components/
        │   ├── Navbar.js
        │   ├── Footer.js
        │   └── FoodCard.js  # Reusable card + PlatformBadge, CouponTag
        ├── context/
        │   └── AuthContext.js
        ├── pages/
        │   ├── Home.js
        │   ├── Search.js        # Grid + Compare view modes
        │   ├── FoodDetail.js    # Platform price comparison
        │   ├── BudgetPlanner.js # AI-style budget optimizer
        │   ├── Login.js
        │   ├── Register.js
        │   ├── Profile.js
        │   ├── Wishlist.js
        │   ├── AdminDashboard.js # Charts + analytics
        │   ├── AdminFoods.js    # Full food CRUD
        │   ├── AdminUsers.js    # User management + pagination
        │   └── NotFound.js
        └── utils/
            └── api.js           # Axios instance with JWT interceptor
```

---

## ⚡ Quick Start

### 1. Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)

### 2. Clone & Install

```bash
# Backend
cd budgetbite/backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret

# Frontend
cd ../frontend
npm install
```

### 3. Set up .env (backend)

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/budgetbite
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
```

### 4. Seed the database

```bash
cd backend
npm run seed
```

This creates:
- ✅ 10 food items with real platform pricing + coupons
- ✅ Admin account: `admin@budgetbite.com` / `admin123`
- ✅ Test user: `user@budgetbite.com` / `user123`

### 5. Run the app

```bash
# Terminal 1 — Backend
cd backend
npm run dev        # runs on http://localhost:5000

# Terminal 2 — Frontend
cd frontend
npm start          # runs on http://localhost:3000
```

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |
| PUT | `/api/auth/profile` | Update profile |
| PUT | `/api/auth/change-password` | Change password |

### Foods
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/foods` | List all foods |
| GET | `/api/foods/trending` | Trending foods |
| GET | `/api/foods/:slug` | Single food detail |
| POST | `/api/foods` | Create food (admin) |
| PUT | `/api/foods/:id` | Update food (admin) |
| DELETE | `/api/foods/:id` | Deactivate food (admin) |

### Search
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/search?q=biryani&maxPrice=300` | Search foods |
| GET | `/api/search/suggestions?q=but` | Autocomplete |

### Budget
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/budget/optimize` | Run budget optimizer |
| POST | `/api/budget/save` | Save meal plan |
| GET | `/api/budget/history` | Saved plans |

### Admin
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/admin/stats` | Dashboard stats + charts |
| GET | `/api/admin/users` | List users (paginated) |
| PUT | `/api/admin/users/:id/toggle` | Activate/deactivate user |
| PUT | `/api/admin/users/:id/role` | Change user role |

---

## 🔮 Extending — Real API Integration

To connect real Swiggy/Zomato APIs, update the `Food` model and add a scraper/aggregator service:

```js
// backend/services/aggregator.js
async function fetchSwiggyPrice(itemName, city) {
  // Use Swiggy partner API or reverse-engineered endpoint
  // Return { price, restaurant, coupon, deliveryTime }
}
```

Then hit these from a cron job to keep prices fresh in MongoDB.

---

## 📦 Production Deployment

```bash
# Frontend build
cd frontend && npm run build

# Serve build with Express (add to server.js):
app.use(express.static(path.join(__dirname, '../frontend/build')));
app.get('*', (req, res) => res.sendFile(path.join(__dirname, '../frontend/build/index.html')));
```

Deploy to: **Railway, Render, Fly.io** (backend) + **Vercel/Netlify** (frontend) or run full-stack on any VPS.

---

## 🎨 Design System

- **Font**: Clash Display (headings) + Sora (body) + JetBrains Mono (prices)
- **Theme**: Dark green (#060d0a base, #00ff88 accent)
- **Components**: Card, Badge, Button (primary/secondary/danger), Skeleton loaders

---

*Built with ❤️ — BudgetBite MERN Stack*
