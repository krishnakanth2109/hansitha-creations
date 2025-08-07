const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");
const Order = require("../models/Order");
require("dotenv").config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

router.post("/payment-link", async (req, res) => {
  try {
    const { amount, customer, cartItems } = req.body;

    console.log("👉 Incoming Checkout Payload:", req.body);

    if (!amount || !customer?.name || !customer?.email || !customer?.phone || !Array.isArray(cartItems)) {
      return res.status(400).json({ error: "Missing required fields" });
    }

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

    const paymentLink = await razorpay.paymentLink.create({
      amount: amount * 100,
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

    res.json({ url: paymentLink.short_url });
  } catch (error) {
    console.error("❌ Payment link error:", error);
    res.status(500).json({ error: "Failed to create payment link" });
  }
});

module.exports = router;
