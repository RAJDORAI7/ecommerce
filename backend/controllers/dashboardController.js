import asyncHandler from 'express-async-handler';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

// @desc    Get dashboard summary statistics
// @route   GET /api/dashboard/stats
// @access  Private/Admin
export const getDashboardStats = asyncHandler(async (req, res) => {
  const productCount = await Product.countDocuments();
  const userCount = await User.countDocuments();
  const orders = await Order.find();
  
  const totalSales = orders
    .filter(order => order.isPaid)
    .reduce((acc, order) => acc + order.totalPrice, 0);

  const pendingOrders = await Order.countDocuments({ orderStatus: 'pending' });
  
  // Daily sales for the last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  const recentOrders = await Order.find({
    createdAt: { $gte: sevenDaysAgo },
    isPaid: true
  });

  // Basic chart data
  const dailySales = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    const dayTotal = recentOrders
      .filter(o => o.createdAt.toISOString().split('T')[0] === dateStr)
      .reduce((acc, o) => acc + o.totalPrice, 0);
      
    dailySales.unshift({ date: dateStr, total: dayTotal });
  }

  res.json({
    success: true,
    data: {
      totalSales,
      productCount,
      userCount,
      pendingOrders,
      dailySales
    }
  });
});
