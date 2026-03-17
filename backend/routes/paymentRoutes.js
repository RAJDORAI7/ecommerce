import express from 'express';
import asyncHandler from 'express-async-handler';
import Stripe from 'stripe';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Create Stripe payment intent
// @route   POST /api/payment/create-intent
// @access  Private
router.post(
  '/create-intent',
  protect,
  asyncHandler(async (req, res) => {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const { amount, currency = 'usd' } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe uses cents
      currency,
      metadata: { userId: req.user._id.toString() },
    });

    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
    });
  })
);

// @desc    Get Stripe publishable key
// @route   GET /api/payment/config
// @access  Public
router.get('/config', (req, res) => {
  res.json({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  });
});

export default router;
