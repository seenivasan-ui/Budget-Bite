require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Food = require('./models/Food');

const foods = [
  {
    name: 'Butter Chicken', slug: 'butter-chicken', category: 'North Indian',
    emoji: '🍛', isVeg: false, isTrending: true,
    description: 'Creamy tomato-based curry with tender chicken pieces',
    tags: ['curry', 'chicken', 'creamy', 'gravy', 'popular'],
    avgRating: 4.5, totalOrders: 1240,
    platforms: [
      { platform: 'Swiggy', price: 189, originalPrice: 220, coupon: 'SAVE30', couponDiscount: 31, couponType: 'flat', restaurant: 'Spice Garden', rating: 4.3, deliveryTime: '30 min', deliveryFee: 30 },
      { platform: 'Zomato', price: 175, originalPrice: 210, coupon: 'ZOM20', couponDiscount: 35, couponType: 'flat', restaurant: 'Royal Kitchen', rating: 4.5, deliveryTime: '25 min', deliveryFee: 25 },
      { platform: 'Magicpin', price: 199, originalPrice: 199, coupon: null, couponDiscount: 0, restaurant: 'Curry House', rating: 4.1, deliveryTime: '35 min', deliveryFee: 40 },
    ]
  },
  {
    name: 'Margherita Pizza', slug: 'margherita-pizza', category: 'Italian',
    emoji: '🍕', isVeg: true, isTrending: true,
    description: 'Classic Italian pizza with fresh mozzarella and basil',
    tags: ['pizza', 'cheese', 'veg', 'italian', 'classic'],
    avgRating: 4.3, totalOrders: 980,
    platforms: [
      { platform: 'Swiggy', price: 149, originalPrice: 180, coupon: 'PIZZA20', couponDiscount: 31, couponType: 'flat', restaurant: 'Pizza Roma', rating: 4.2, deliveryTime: '40 min', deliveryFee: 35 },
      { platform: 'Zomato', price: 159, originalPrice: 190, coupon: 'FLAT30', couponDiscount: 31, couponType: 'flat', restaurant: 'Slice & Co', rating: 4.4, deliveryTime: '35 min', deliveryFee: 30 },
      { platform: 'EatSure', price: 145, originalPrice: 175, coupon: 'NEW15', couponDiscount: 30, couponType: 'flat', restaurant: 'Urban Pizza', rating: 4.0, deliveryTime: '45 min', deliveryFee: 20 },
    ]
  },
  {
    name: 'Chicken Biryani', slug: 'chicken-biryani', category: 'Biryani',
    emoji: '🍚', isVeg: false, isTrending: true,
    description: 'Fragrant basmati rice cooked with spiced chicken dum style',
    tags: ['biryani', 'chicken', 'rice', 'dum', 'spicy'],
    avgRating: 4.7, totalOrders: 2100,
    platforms: [
      { platform: 'Swiggy', price: 249, originalPrice: 280, coupon: 'BIRI30', couponDiscount: 31, couponType: 'flat', restaurant: 'Dum Biryani', rating: 4.6, deliveryTime: '45 min', deliveryFee: 25 },
      { platform: 'Zomato', price: 229, originalPrice: 270, coupon: 'ZOM40', couponDiscount: 41, couponType: 'flat', restaurant: "Nawab's", rating: 4.7, deliveryTime: '40 min', deliveryFee: 20 },
      { platform: 'Dunzo', price: 259, originalPrice: 290, coupon: 'D20', couponDiscount: 31, couponType: 'flat', restaurant: 'Biryani Bowl', rating: 4.2, deliveryTime: '50 min', deliveryFee: 30 },
    ]
  },
  {
    name: 'Veg Burger', slug: 'veg-burger', category: 'Fast Food',
    emoji: '🍔', isVeg: true, isTrending: false,
    description: 'Crispy veggie patty with fresh veggies in a toasted bun',
    tags: ['burger', 'veg', 'fast food', 'snack'],
    avgRating: 4.0, totalOrders: 760,
    platforms: [
      { platform: 'Swiggy', price: 99, originalPrice: 120, coupon: 'BURGER25', couponDiscount: 21, couponType: 'flat', restaurant: 'BurgerBox', rating: 4.0, deliveryTime: '20 min', deliveryFee: 20 },
      { platform: 'Zomato', price: 89, originalPrice: 110, coupon: 'ZOM20', couponDiscount: 21, couponType: 'flat', restaurant: 'Grill Nation', rating: 4.2, deliveryTime: '25 min', deliveryFee: 25 },
      { platform: 'Magicpin', price: 109, originalPrice: 130, coupon: 'MP10', couponDiscount: 21, couponType: 'flat', restaurant: 'Stack House', rating: 3.9, deliveryTime: '30 min', deliveryFee: 30 },
    ]
  },
  {
    name: 'Paneer Tikka', slug: 'paneer-tikka', category: 'North Indian',
    emoji: '🧆', isVeg: true, isTrending: true,
    description: 'Grilled cottage cheese marinated in spiced yogurt',
    tags: ['paneer', 'tikka', 'grilled', 'veg', 'starter'],
    avgRating: 4.4, totalOrders: 870,
    platforms: [
      { platform: 'Swiggy', price: 169, originalPrice: 200, coupon: 'PANEER20', couponDiscount: 31, couponType: 'flat', restaurant: 'Tandoor Tales', rating: 4.3, deliveryTime: '35 min', deliveryFee: 30 },
      { platform: 'Zomato', price: 155, originalPrice: 190, coupon: 'ZOM35', couponDiscount: 35, couponType: 'flat', restaurant: 'Grill & Spice', rating: 4.5, deliveryTime: '30 min', deliveryFee: 25 },
      { platform: 'EatSure', price: 179, originalPrice: 210, coupon: null, couponDiscount: 0, restaurant: 'Punjabi Tadka', rating: 4.1, deliveryTime: '40 min', deliveryFee: 35 },
    ]
  },
  {
    name: 'Masala Dosa', slug: 'masala-dosa', category: 'South Indian',
    emoji: '🫓', isVeg: true, isTrending: false,
    description: 'Crispy rice crepe filled with spiced potato stuffing',
    tags: ['dosa', 'south indian', 'breakfast', 'crispy', 'veg'],
    avgRating: 4.5, totalOrders: 1100,
    platforms: [
      { platform: 'Swiggy', price: 79, originalPrice: 95, coupon: 'SOUTH15', couponDiscount: 16, couponType: 'flat', restaurant: 'Udupi Palace', rating: 4.4, deliveryTime: '25 min', deliveryFee: 20 },
      { platform: 'Zomato', price: 69, originalPrice: 85, coupon: 'ZOM15', couponDiscount: 16, couponType: 'flat', restaurant: 'MTR Express', rating: 4.6, deliveryTime: '20 min', deliveryFee: 15 },
      { platform: 'Magicpin', price: 85, originalPrice: 100, coupon: 'MP10', couponDiscount: 15, couponType: 'flat', restaurant: 'Saravana Bhavan', rating: 4.2, deliveryTime: '30 min', deliveryFee: 25 },
    ]
  },
  {
    name: 'Hakka Noodles', slug: 'hakka-noodles', category: 'Chinese',
    emoji: '🍜', isVeg: false, isTrending: false,
    description: 'Stir-fried noodles with vegetables and soy sauce',
    tags: ['noodles', 'chinese', 'stir fry', 'indo chinese'],
    avgRating: 4.1, totalOrders: 650,
    platforms: [
      { platform: 'Swiggy', price: 129, originalPrice: 150, coupon: 'CHINESE20', couponDiscount: 21, couponType: 'flat', restaurant: 'Wok Express', rating: 4.1, deliveryTime: '30 min', deliveryFee: 25 },
      { platform: 'Zomato', price: 119, originalPrice: 145, coupon: 'ZOM25', couponDiscount: 26, couponType: 'flat', restaurant: 'China Town', rating: 4.3, deliveryTime: '25 min', deliveryFee: 20 },
    ]
  },
  {
    name: 'Cold Coffee', slug: 'cold-coffee', category: 'Beverages',
    emoji: '☕', isVeg: true, isTrending: false,
    description: 'Chilled blended coffee with milk and ice cream',
    tags: ['coffee', 'cold drink', 'beverage', 'sweet'],
    avgRating: 4.2, totalOrders: 430,
    platforms: [
      { platform: 'Swiggy', price: 89, originalPrice: 110, coupon: 'DRINK10', couponDiscount: 21, couponType: 'flat', restaurant: 'Cafe Mocha', rating: 4.2, deliveryTime: '20 min', deliveryFee: 20 },
      { platform: 'Zomato', price: 79, originalPrice: 99, coupon: 'ZOM20', couponDiscount: 20, couponType: 'flat', restaurant: 'Brew & Co', rating: 4.4, deliveryTime: '15 min', deliveryFee: 15 },
      { platform: 'Dunzo', price: 95, originalPrice: 115, coupon: null, couponDiscount: 0, restaurant: 'The Coffee Hub', rating: 4.0, deliveryTime: '25 min', deliveryFee: 25 },
    ]
  },
  {
    name: 'Gulab Jamun', slug: 'gulab-jamun', category: 'Desserts',
    emoji: '🍮', isVeg: true, isTrending: false,
    description: 'Soft milk-solid balls soaked in rose-flavored sugar syrup',
    tags: ['dessert', 'sweet', 'indian', 'mithai'],
    avgRating: 4.6, totalOrders: 580,
    platforms: [
      { platform: 'Swiggy', price: 59, originalPrice: 75, coupon: 'SWEET10', couponDiscount: 16, couponType: 'flat', restaurant: 'Halwai House', rating: 4.5, deliveryTime: '25 min', deliveryFee: 20 },
      { platform: 'Zomato', price: 49, originalPrice: 65, coupon: 'ZOM15', couponDiscount: 16, couponType: 'flat', restaurant: 'Sweet Spot', rating: 4.7, deliveryTime: '20 min', deliveryFee: 15 },
    ]
  },
  {
    name: 'Samosa', slug: 'samosa', category: 'Snacks',
    emoji: '🥟', isVeg: true, isTrending: false,
    description: 'Crispy pastry filled with spiced potato and peas',
    tags: ['samosa', 'snack', 'fried', 'veg', 'street food'],
    avgRating: 4.3, totalOrders: 920,
    platforms: [
      { platform: 'Swiggy', price: 39, originalPrice: 50, coupon: 'SNACK10', couponDiscount: 11, couponType: 'flat', restaurant: 'Chaat Corner', rating: 4.2, deliveryTime: '20 min', deliveryFee: 20 },
      { platform: 'Zomato', price: 35, originalPrice: 45, coupon: null, couponDiscount: 0, restaurant: 'Street Bites', rating: 4.4, deliveryTime: '15 min', deliveryFee: 15 },
      { platform: 'Magicpin', price: 42, originalPrice: 55, coupon: 'MP5', couponDiscount: 13, couponType: 'flat', restaurant: 'Snack Shack', rating: 4.1, deliveryTime: '25 min', deliveryFee: 20 },
    ]
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    await Food.deleteMany({});
    await User.deleteMany({});

    await Food.insertMany(foods);
    console.log(`✅ Seeded ${foods.length} food items`);

    // Create admin user
    await User.create({
      name: 'Admin User',
      email: 'admin@budgetbite.com',
      password: 'admin123',
      role: 'admin',
      city: 'Mumbai'
    });

    // Create test user
    await User.create({
      name: 'Test User',
      email: 'user@budgetbite.com',
      password: 'user123',
      city: 'Bangalore'
    });

    console.log('✅ Created admin: admin@budgetbite.com / admin123');
    console.log('✅ Created user:  user@budgetbite.com / user123');
    console.log('🎉 Seed complete!');
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  }
}

seed();
