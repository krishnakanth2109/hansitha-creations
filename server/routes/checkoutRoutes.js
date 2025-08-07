const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

// Route 1: Create Razorpay Order
router.post('/create-order', async (req, res) => {
  try {
    const { totalAmount } = req.body;

    if (!totalAmount || typeof totalAmount !== 'number') {
      return res.status(400).json({ message: 'Invalid or missing totalAmount' });
    }

    const options = {
      amount: totalAmount * 100, // Razorpay accepts paise
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.json({ orderId: order.id, amount: order.amount, currency: order.currency });
  } catch (err) {
    console.error('Error creating Razorpay order:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Route 2: Save Order After Payment
router.post('/confirm', async (req, res) => {
  try {
    const {
      userId,
      cartItems,
      totalAmount,
      address,
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature,
    } = req.body;

    if (!userId || !cartItems || !totalAmount || !address || !razorpayPaymentId || !razorpayOrderId || !razorpaySignature) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Verify Razorpay Signature
    const body = `${razorpayOrderId}|${razorpayPaymentId}`;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpaySignature) {
      return res.status(400).json({ message: 'Invalid signature' });
    }

    const newOrder = new Order({
      user: userId,
      products: cartItems,
      totalAmount,
      shippingAddress: address,
      isPaid: true,
      paymentId: razorpayPaymentId,
      razorpayOrderId,
    });

    await newOrder.save();

    res.status(201).json({ message: 'Order placed successfully', orderId: newOrder._id });
  } catch (err) {
    console.error('Order saving error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
