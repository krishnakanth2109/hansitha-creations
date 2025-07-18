const express = require("express");
const auth = require("../middleware/auth.js");
const User = require("../models/User.model.js");

const router = express.Router();

// ✅ Get current user (secure)
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate("wishlist")
      .populate("cart.product");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Error fetching user", error: err });
  }
});

// ✅ Add to cart
router.post("/cart", auth, async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || typeof quantity !== "number") {
      return res.status(400).json({ message: "Missing productId or quantity" });
    }

    const user = await User.findById(req.user.id);
    const existingItem = user.cart.find(
      item => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      user.cart.push({ product: productId, quantity });
    }

    await user.save();
    res.json(user.cart);
  } catch (err) {
    res.status(500).json({ message: "Error adding to cart", error: err });
  }
});

// ✅ Remove from cart
router.delete("/cart/:id", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.cart = user.cart.filter(item => item.product.toString() !== req.params.id);
    await user.save();
    res.json(user.cart);
  } catch (err) {
    res.status(500).json({ message: "Error removing from cart", error: err });
  }
});

// ✅ Add to wishlist
// ✅ Toggle wishlist item
router.post("/wishlist", auth, async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({ message: "Missing productId" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const index = user.wishlist.findIndex(
      (pid) => pid.toString() === productId
    );

    if (index === -1) {
      user.wishlist.push(productId); // ➕ Add
    } else {
      user.wishlist.splice(index, 1); // ❌ Remove
    }

    await user.save();
    res.status(200).json({ wishlist: user.wishlist });
  } catch (err) {
    console.error("Error adding/removing wishlist item:", err);
    res
      .status(500)
      .json({ message: "Error toggling wishlist", error: err.message });
  }
});


// ✅ Remove from wishlist
router.delete("/wishlist/:id", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.wishlist = user.wishlist.filter(pid => pid.toString() !== req.params.id);
    await user.save();
    res.json(user.wishlist);
  } catch (err) {
    res.status(500).json({ message: "Error removing from wishlist", error: err });
  }
});

// ✅ Place order
router.post("/order", auth, async (req, res) => {
  try {
    const { products, total } = req.body;
    if (!products || typeof total !== "number") {
      return res.status(400).json({ message: "Missing products or total" });
    }

    const user = await User.findById(req.user.id);
    user.orders.push({ products, total });
    await user.save();
    res.json(user.orders);
  } catch (err) {
    res.status(500).json({ message: "Error placing order", error: err });
  }
});

module.exports = router;
