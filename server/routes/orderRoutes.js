const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// ✅ POST /api/orders - Create a new order
router.post('/', async (req, res) => {
  try {
    const { email, address, cartItems, totalAmount } = req.body;

    const newOrder = new Order({
      email,
      address,
      cartItems,
      totalAmount,
    });

    const savedOrder = await newOrder.save();

    // ✅ Emit real-time event using socket.io
    const io = req.app.get('io');
    if (io) {
      io.emit('newOrder', {
        _id: savedOrder._id,
        email: savedOrder.email,
        totalAmount: savedOrder.totalAmount,
        createdAt: savedOrder.createdAt,
      });
      console.log("📢 Emitted newOrder");
    }

    res.status(201).json({ success: true, order: savedOrder });
  } catch (err) {
    console.error("❌ Error saving order:", err);
    res.status(500).json({ success: false, message: 'Failed to create order' });
  }
});

// ✅ GET /api/orders - Fetch all orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch orders from DB' });
  }
});

// ✅ GET /api/orders/count - Get total order count
router.get('/count', async (req, res) => {
  try {
    const count = await Order.countDocuments();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: 'Failed to count orders' });
  }
});

module.exports = router;
