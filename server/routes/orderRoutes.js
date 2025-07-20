const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

router.get('/count', async (req, res) => {
  try {
    const count = await Order.countDocuments(); // or filter for unread
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});


// ✅ GET /api/orders - fetch all orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders from Db to Admin' });
  }
});

// ✅ POST /api/orders - create a new order (used by frontend when placing order)
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
    const io = req.app.get('io'); // get io instance from app
    io.emit('newOrder', {
      _id: savedOrder._id,
      email: savedOrder.email,
      totalAmount: savedOrder.totalAmount,
      createdAt: savedOrder.createdAt,
    });

    res.status(201).json(savedOrder);
  } catch (error) {
    console.error('Order create error:', error);
    res.status(500).json({ message: 'Failed to create order' });
  }
});

// ✅ GET /api/orders/count - get total order count
router.get('/count', async (req, res) => {
  try {
    const count = await Order.countDocuments();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: 'Failed to count orders' });
  }
});

module.exports = router;
