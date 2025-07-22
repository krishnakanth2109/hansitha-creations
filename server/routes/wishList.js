// routes/wishlist.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Wishlist = require("../models/Wishlist"); // Adjust path if needed

router.post("/toggle", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    let wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      wishlist = new Wishlist({ user: userId, products: [productId] });
    } else {
      const index = wishlist.products.indexOf(productId);
      if (index === -1) {
        wishlist.products.push(productId);
      } else {
        wishlist.products.splice(index, 1);
      }
    }

    await wishlist.save();
    res.json({ wishlist: wishlist.products });
  } catch (err) {
    console.error("Toggle wishlist failed:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
