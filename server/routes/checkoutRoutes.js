const express = require("express");
const Razorpay = require("razorpay");
const Order = require("../models/Order");

const router = express.Router();

// Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ✅ Step 1: Create Razorpay Order
router.post("/razorpay", async (req, res) => {
  try {
    const { totalAmount } = req.body;

    if (!totalAmount || typeof totalAmount !== "number") {
      return res.status(400).json({ message: "Invalid or missing totalAmount" });
    }

    const options = {
      amount: totalAmount * 100, // Convert to paisa
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.status(200).json({ orderId: order.id, amount: order.amount });
  } catch (err) {
    console.error("Razorpay order creation failed:", err);
    res.status(500).json({ message: "Failed to create Razorpay order" });
  }
});

// ✅ Step 2: Save Order in DB after payment success
router.post("/", async (req, res) => {
  try {
    const { userId, cartItems, totalAmount, address, paymentId, razorpayOrderId } = req.body;

    if (!userId || !cartItems || !totalAmount || !address) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newOrder = new Order({
      user: userId,
      products: cartItems,
      totalAmount,
      shippingAddress: address,
      paymentId,
      razorpayOrderId,
    });

    await newOrder.save();

    res.status(201).json({ message: "Order created", orderId: newOrder._id });
  } catch (error) {
    console.error("Order save failed:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
