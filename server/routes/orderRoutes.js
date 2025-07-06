const express = require('express');
const router = express.Router();

router.post('/place-order', async (req, res) => {
  try {
    const { products } = req.body;
    console.log('Received order:', products);
    res.status(200).json({ message: 'Order placed successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to place order' });
  }
});

// src/server/controllers/orderController.js
module.exports = {
  placeOrder: (req, res) => {
    res.json({ message: 'Order placed (mock)' });
  }
};

