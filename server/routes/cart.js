// routes/cart.js
import express from 'express';
import Cart from '../models/Cart.js';

const router = express.Router();

// Get cart for user
router.get('/:userId', async (req, res) => {
  const cart = await Cart.findOne({ userId: req.params.userId });
  res.json(cart?.items || []);
});

// Save/update cart
router.post('/:userId', async (req, res) => {
  const { items } = req.body;
  const userId = req.params.userId;

  const cart = await Cart.findOneAndUpdate(
    { userId },
    { items },
    { upsert: true, new: true }
  );

  res.json(cart);
});

export default router;
