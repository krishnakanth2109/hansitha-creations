const express = require("express");
const auth = require("../middleware/auth.js");
const User = require("../models/User.model.js");

const router = express.Router();

// ✅ Login Route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password are required" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password); // ✅ direct compare
    if (!isMatch)
      return res.status(401).json({ message: "Invalid email or password" });

    // ✅ Create JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // ✅ Send cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({ message: "Login successful", userId: user._id, email: user.email, name: user.name });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
});


router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate("wishlist")
      .populate("cart.product");

    res.json({ user }); // ✅ Wrap inside a `user` key
  } catch (err) {
    res.status(500).json({ message: "Error fetching user", error: err });
  }
});


// routes/user.routes.js
router.post("/cart", auth, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    const productIndex = user.cart.findIndex(
      (item) => item.product.toString() === productId
    );

    if (productIndex !== -1) {
      user.cart[productIndex].quantity += quantity;
    } else {
      user.cart.push({ product: productId, quantity });
    }

    await user.save();
    res.json({ cart: user.cart });
  } catch (err) {
    console.error("Cart error:", err);
    res.status(500).json({ message: "Failed to update cart" });
  }
});


// routes/user.routes.js (or wherever you handle wishlist logic)
router.post("/wishlist", auth, async (req, res) => {
  try {
    const { productId } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const alreadyInWishlist = user.wishlist.includes(productId);

    if (alreadyInWishlist) {
      user.wishlist.pull(productId); // remove
    } else {
      user.wishlist.push(productId); // add
    }

    await user.save();

    res.json({ wishlist: user.wishlist });
  } catch (error) {
    console.error("Wishlist error", error);
    res.status(500).json({ message: "Server error updating wishlist" });
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
