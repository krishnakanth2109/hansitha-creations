const express = require("express");
const auth = require("../middleware/auth.js");
const User = require("../models/User.model.js");

const router = express.Router();

// Get current user
router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json(user);
});

// Add to cart
router.post("/cart", auth, async (req, res) => {
  const { productId, quantity } = req.body;
  const user = await User.findById(req.user.id);
  const existing = user.cart.find(item => item.productId.toString() === productId);
  if (existing) existing.quantity += quantity;
  else user.cart.push({ productId, quantity });
  await user.save();
  res.json(user.cart);
});

// Remove from cart
router.delete("/cart/:id", auth, async (req, res) => {
  const user = await User.findById(req.user.id);
  user.cart = user.cart.filter(item => item.productId.toString() !== req.params.id);
  await user.save();
  res.json(user.cart);
});

// Add to wishlist
router.post("/wishlist", auth, async (req, res) => {
  const { productId } = req.body;
  const user = await User.findById(req.user.id);
  if (!user.wishlist.includes(productId)) user.wishlist.push(productId);
  await user.save();
  res.json(user.wishlist);
});

// Remove from wishlist
router.delete("/wishlist/:id", auth, async (req, res) => {
  const user = await User.findById(req.user.id);
  user.wishlist = user.wishlist.filter(pid => pid.toString() !== req.params.id);
  await user.save();
  res.json(user.wishlist);
});

// Place an order
router.post("/order", auth, async (req, res) => {
  const { products, total } = req.body;
  const user = await User.findById(req.user.id);
  user.orders.push({ products, total });
  await user.save();
  res.json(user.orders);
});

module.exports = router;
