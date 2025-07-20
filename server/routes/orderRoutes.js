const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// GET /api/orders - fetch all orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders from Db to Admin' });
  }
});

// POST /api/orders - create a new order (used by frontend when placing order)
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
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create order' });
  }
});

module.exports = router;
