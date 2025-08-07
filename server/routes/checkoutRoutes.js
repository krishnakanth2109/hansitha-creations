const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");
const Order = require("../models/Order");
require("dotenv").config();

// Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ✅ Health check / test route
router.get("/test", (req, res) => {
  res.send("✅ /api/checkout route is working");
});

// ✅ Payment link route
router.post("/payment-link", async (req, res) => {
  const { amount, customer, cartItems } = req.body;

  console.log("👉 Incoming Checkout Payload:", req.body);

  // Basic validation
  if (!amount || !customer?.name || !customer?.email || !customer?.phone || !cartItems?.length) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Save order to MongoDB
    const newOrder = new Order({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      amount,
      cartItems,
      status: "pending",
      createdAt: new Date(),
    });

    const savedOrder = await newOrder.save();
    console.log("✅ Order saved:", savedOrder._id);

    // Create Razorpay payment link
    const paymentLink = await razorpay.paymentLink.create({
      amount: amount * 100, // ₹ to paise
      currency: "INR",
      accept_partial: false,
      customer: {
        name: customer.name,
        email: customer.email,
        contact: customer.phone,
      },
      notify: {
        sms: true,
        email: true,
      },
      reminder_enable: true,
      notes: {
        orderId: savedOrder._id.toString(),
      },
      callback_url: `${process.env.FRONTEND_URL}/order-confirmation`,
      callback_method: "get",
    });

    return res.json({ url: paymentLink.short_url });
  } catch (err) {
    console.error("❌ Error generating payment link:", err);
    return res.status(500).json({ error: "Something went wrong" });
  }
});

module.exports = router;
