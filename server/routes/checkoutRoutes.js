const express = require("express");
const router = express.Router();
const User = require("../models/User.model");

router.post("/", async (req, res) => {
  try {
    const {
      userId,          // email
      cartItems,       // [{ id, name, quantity, price }]
      totalAmount,     // number
      address,         // { name, email, phone }
      paymentId,       // from Razorpay
      razorpayOrderId, // from Razorpay
    } = req.body;

    // 1. Find user by email
    const user = await User.findOne({ email: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2. Format order according to your schema
    const orderProducts = cartItems.map((item) => ({
      product: item.id,
      quantity: item.quantity,
    }));

    const newOrder = {
      products: orderProducts,
      total: totalAmount,
      createdAt: new Date(),
      paymentId,
      razorpayOrderId,
    };

    // 3. Save order in user.orders
    user.orders.push(newOrder);
    await user.save();

    res.status(201).json({ message: "Order saved successfully" });
  } catch (err) {
    console.error("Error saving order:", err);
    res.status(500).json({ message: "Failed to save order" });
  }
});

module.exports = router;
