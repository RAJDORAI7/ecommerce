import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import colors from 'colors';

// Load env vars
dotenv.config();

// Import models
import User from '../models/User.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';

// Connect to MongoDB
const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI);
  console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
};

// ─── SEED DATA ───────────────────────────────────────────────

const categories = [
  { name: 'Electronics',   description: 'Gadgets, devices and electronic accessories' },
  { name: 'Clothing',      description: 'Men, women and kids clothing and fashion' },
  { name: 'Home & Kitchen',description: 'Home appliances, decor and kitchen essentials' },
  { name: 'Books',         description: 'Fiction, non-fiction, educational and more' },
  { name: 'Sports',        description: 'Sports equipment and outdoor gear' },
  { name: 'Beauty',        description: 'Skincare, haircare and personal care products' },
];

const adminUser = {
  name: 'Admin',
  email: 'admin@ecommerce.com',
  password: 'Admin@123',
  role: 'admin',
};

// Products are created after categories so we use placeholder and replace below
const getProducts = (adminId, categoryMap) => [
  // Electronics
  {
    name: 'Apple iPhone 15 Pro',
    description: 'Latest Apple iPhone with A17 Pro chip, titanium design, and advanced camera system.',
    price: 134900,
    discountPrice: 124900,
    category: categoryMap['Electronics'],
    brand: 'Apple',
    stock: 50,
    images: [
      { public_id: 'sample_iphone', url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600' },
    ],
    rating: 4.8,
    numReviews: 124,
    isFeatured: true,
    tags: ['iphone', 'smartphone', 'apple', '5g'],
    seller: adminId,
  },
  {
    name: 'Samsung Galaxy S24 Ultra',
    description: 'Samsung\'s flagship with 200MP camera, S Pen, and Snapdragon 8 Gen 3.',
    price: 124999,
    discountPrice: 114999,
    category: categoryMap['Electronics'],
    brand: 'Samsung',
    stock: 35,
    images: [
      { public_id: 'sample_s24', url: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600' },
    ],
    rating: 4.7,
    numReviews: 89,
    isFeatured: true,
    tags: ['samsung', 'android', 'smartphone', 's-pen'],
    seller: adminId,
  },
  {
    name: 'Sony WH-1000XM5 Headphones',
    description: 'Industry-leading noise cancelling wireless headphones with 30-hour battery life.',
    price: 29990,
    discountPrice: 24990,
    category: categoryMap['Electronics'],
    brand: 'Sony',
    stock: 80,
    images: [
      { public_id: 'sample_headphones', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600' },
    ],
    rating: 4.9,
    numReviews: 312,
    isFeatured: true,
    tags: ['headphones', 'audio', 'noise-cancelling', 'wireless'],
    seller: adminId,
  },
  {
    name: 'MacBook Air M3',
    description: 'Apple MacBook Air with M3 chip – thin, light and blazingly fast with 18-hour battery.',
    price: 114900,
    discountPrice: 109900,
    category: categoryMap['Electronics'],
    brand: 'Apple',
    stock: 25,
    images: [
      { public_id: 'sample_macbook', url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600' },
    ],
    rating: 4.9,
    numReviews: 201,
    isFeatured: true,
    tags: ['laptop', 'macbook', 'apple', 'm3'],
    seller: adminId,
  },
  // Clothing
  {
    name: 'Men\'s Classic Polo T-Shirt',
    description: 'Premium cotton polo shirt available in multiple colours, perfect for casual wear.',
    price: 1299,
    discountPrice: 999,
    category: categoryMap['Clothing'],
    brand: 'FashionHub',
    stock: 200,
    images: [
      { public_id: 'sample_polo', url: 'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=600' },
    ],
    rating: 4.3,
    numReviews: 55,
    isFeatured: false,
    tags: ['polo', 'tshirt', 'men', 'casual'],
    seller: adminId,
  },
  {
    name: 'Women\'s Floral Kurta Set',
    description: 'Elegant floral print kurti set with dupatta, made with soft rayon fabric.',
    price: 1899,
    discountPrice: 1499,
    category: categoryMap['Clothing'],
    brand: 'Ethnics',
    stock: 150,
    images: [
      { public_id: 'sample_kurta', url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600' },
    ],
    rating: 4.5,
    numReviews: 78,
    isFeatured: false,
    tags: ['kurta', 'women', 'ethnic', 'floral'],
    seller: adminId,
  },
  // Home & Kitchen
  {
    name: 'Instant Pot Duo 7-in-1',
    description: 'Multi-use programmable pressure cooker – pressure cook, slow cook, rice cooker and more.',
    price: 8999,
    discountPrice: 6999,
    category: categoryMap['Home & Kitchen'],
    brand: 'Instant Pot',
    stock: 60,
    images: [
      { public_id: 'sample_instantpot', url: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=600' },
    ],
    rating: 4.6,
    numReviews: 430,
    isFeatured: true,
    tags: ['kitchen', 'cooker', 'appliance', 'instant pot'],
    seller: adminId,
  },
  {
    name: 'Philips Air Fryer HD9252',
    description: 'Digital air fryer with Rapid Air technology – up to 90% less fat than deep frying.',
    price: 9999,
    discountPrice: 7999,
    category: categoryMap['Home & Kitchen'],
    brand: 'Philips',
    stock: 45,
    images: [
      { public_id: 'sample_airfryer', url: 'https://images.unsplash.com/photo-1648146540074-1f7d0fca5609?w=600' },
    ],
    rating: 4.5,
    numReviews: 215,
    isFeatured: false,
    tags: ['air fryer', 'kitchen', 'philips', 'healthy cooking'],
    seller: adminId,
  },
  // Books
  {
    name: 'Atomic Habits by James Clear',
    description: 'An easy and proven way to build good habits and break bad ones. Bestseller worldwide.',
    price: 599,
    discountPrice: 399,
    category: categoryMap['Books'],
    brand: 'Random House',
    stock: 300,
    images: [
      { public_id: 'sample_atomichabits', url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600' },
    ],
    rating: 4.9,
    numReviews: 2100,
    isFeatured: true,
    tags: ['books', 'self-help', 'habits', 'productivity'],
    seller: adminId,
  },
  {
    name: 'The Psychology of Money',
    description: 'Timeless lessons on wealth, greed, and happiness by Morgan Housel.',
    price: 499,
    discountPrice: 349,
    category: categoryMap['Books'],
    brand: 'Harriman House',
    stock: 250,
    images: [
      { public_id: 'sample_psychmoney', url: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=600' },
    ],
    rating: 4.8,
    numReviews: 1540,
    isFeatured: true,
    tags: ['finance', 'money', 'investing', 'books'],
    seller: adminId,
  },
  // Sports
  {
    name: 'Yonex Nanoray 7000i Badminton Racket',
    description: 'Lightweight graphite badminton racket ideal for intermediate and advanced players.',
    price: 2499,
    discountPrice: 1999,
    category: categoryMap['Sports'],
    brand: 'Yonex',
    stock: 100,
    images: [
      { public_id: 'sample_badminton', url: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600' },
    ],
    rating: 4.4,
    numReviews: 67,
    isFeatured: false,
    tags: ['badminton', 'sports', 'yonex', 'racket'],
    seller: adminId,
  },
  {
    name: 'Nike Running Shoes Air Zoom Pegasus',
    description: 'Responsive cushioning and a breathable upper for your everyday run.',
    price: 11995,
    discountPrice: 9995,
    category: categoryMap['Sports'],
    brand: 'Nike',
    stock: 75,
    images: [
      { public_id: 'sample_nikeshoes', url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600' },
    ],
    rating: 4.6,
    numReviews: 320,
    isFeatured: true,
    tags: ['shoes', 'running', 'nike', 'sports'],
    seller: adminId,
  },
  // Beauty
  {
    name: 'Mamaearth Vitamin C Face Serum',
    description: 'Brightening face serum with vitamin C and turmeric for glowing skin.',
    price: 699,
    discountPrice: 549,
    category: categoryMap['Beauty'],
    brand: 'Mamaearth',
    stock: 180,
    images: [
      { public_id: 'sample_serum', url: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600' },
    ],
    rating: 4.3,
    numReviews: 450,
    isFeatured: false,
    tags: ['skincare', 'vitamin c', 'serum', 'beauty'],
    seller: adminId,
  },
  {
    name: 'L\'Oreal Paris Extraordinary Oil Serum',
    description: 'Nourishing hair serum with 6 rare flower oils for frizz-free shine.',
    price: 449,
    discountPrice: 379,
    category: categoryMap['Beauty'],
    brand: "L'Oreal",
    stock: 220,
    images: [
      { public_id: 'sample_hairserum', url: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=600' },
    ],
    rating: 4.2,
    numReviews: 290,
    isFeatured: false,
    tags: ['haircare', 'serum', 'loreal', 'beauty'],
    seller: adminId,
  },
];

// ─── IMPORT DATA ─────────────────────────────────────────────

const importData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Order.deleteMany();
    await Cart.deleteMany();
    await Product.deleteMany();
    await Category.deleteMany();
    await User.deleteMany();

    console.log('✔ Existing data cleared'.yellow);

    // Create admin user
    const createdUser = await User.create(adminUser);
    const adminId = createdUser._id;
    console.log(`✔ Admin user created  →  ${adminUser.email}`.green);

    // Create categories
    const createdCategories = await Category.insertMany(categories);
    const categoryMap = {};
    createdCategories.forEach((cat) => {
      categoryMap[cat.name] = cat._id;
    });
    console.log(`✔ ${createdCategories.length} categories created`.green);

    // Create products
    const products = getProducts(adminId, categoryMap);
    await Product.insertMany(products);
    console.log(`✔ ${products.length} products created`.green);

    console.log('\n🎉  Data seeded successfully!'.green.bold);
    console.log('─────────────────────────────────'.grey);
    console.log(`Admin Email    : ${adminUser.email}`.cyan);
    console.log(`Admin Password : ${adminUser.password}`.cyan);
    console.log('─────────────────────────────────'.grey);

    process.exit(0);
  } catch (error) {
    console.error(`Error: ${error.message}`.red.bold);
    process.exit(1);
  }
};

// ─── DESTROY DATA ────────────────────────────────────────────

const destroyData = async () => {
  try {
    await connectDB();

    await Order.deleteMany();
    await Cart.deleteMany();
    await Product.deleteMany();
    await Category.deleteMany();
    await User.deleteMany();

    console.log('🗑  All data destroyed!'.red.bold);
    process.exit(0);
  } catch (error) {
    console.error(`Error: ${error.message}`.red.bold);
    process.exit(1);
  }
};

// ─── CLI ENTRY ───────────────────────────────────────────────

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
