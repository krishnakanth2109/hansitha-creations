const express = require("express");
const Razorpay = require("razorpay");
const router = express.Router();
const crypto = require("crypto");
require("dotenv").config();

const Order = require("../models/Order.model");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ✅ Create Payment Link and Save Order
router.post("/create-payment-link", async (req, res) => {
  try {
    const { totalAmount, userName, userEmail, userPhone, cartItems } = req.body;

    // Save pending order
    const newOrder = new Order({
      name: userName,
      email: userEmail,
      phone: userPhone,
      amount: totalAmount,
      cartItems,
      status: "pending",
    });

    const savedOrder = await newOrder.save();
    console.log("✅ Order saved:", savedOrder._id);

    // Create Razorpay payment link
    const paymentLink = await razorpay.paymentLink.create({
      amount: totalAmount * 100,
      currency: "INR",
      accept_partial: false,
      description: "Hansitha Creations Order Payment",
      customer: {
        name: userName,
        email: userEmail,
        contact: userPhone,
      },
      notify: {
        email: true,
        sms: true,
      },
      reminder_enable: true,
      notes: {
        orderId: savedOrder._id.toString(), // track which order
      },
      callback_url: `${process.env.FRONTEND_URL}/order-success`,
      callback_method: "get",
    });

    return res.json({ url: paymentLink.short_url });
  } catch (err) {
    console.error("❌ Error creating payment link:", err);
    res.status(500).json({ error: "Failed to create payment link" });
  }
});
