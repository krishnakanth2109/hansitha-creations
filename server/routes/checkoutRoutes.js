// routes/checkout.js or inside any route handler
const Razorpay = require('razorpay');
const express = require('express');
const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

router.post('/checkout', async (req, res) => {
  try {
    const { totalAmount } = req.body;

    console.log('Incoming totalAmount:', totalAmount);
    console.log('Full request body:', req.body);

    if (!totalAmount || typeof totalAmount !== 'number') {
      return res.status(400).json({ message: 'Invalid or missing totalAmount' });
    }

    const options = {
      amount: totalAmount * 100,
      currency: 'INR',
      receipt: `receipt_order_${Math.random().toString(36).substring(2, 15)}`,
    };

    const order = await razorpay.orders.create(options);
    res.json({ orderId: order.id, amount: order.amount });
  } catch (err) {
    console.error('Checkout error:', err);
    res.status(500).json({ message: err.message || 'Something went wrong' });
  }
});


module.exports = router;
