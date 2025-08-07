const express = require("express");
const Razorpay = require("razorpay");
const router = express.Router();
const Order = require("../models/Order");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// 🚀 Create payment link + save order
router.post("/payment-link", async (req, res) => {
  try {
    const { userName, userEmail, userPhone, cartItems, totalAmount } = req.body;

    if (!userName || !userEmail || !totalAmount) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const paymentLink = await razorpay.paymentLink.create({
      amount: totalAmount * 100, // in paise
      currency: "INR",
      description: "Order Payment",
      customer: {
        name: userName,
        email: userEmail,
        contact: userPhone || undefined,
      },
      notify: {
        sms: true,
        email: true,
      },
      notes: {
        email: userEmail,
      },
      callback_url: `${process.env.FRONTEND_URL}/order-confirmation`,
      callback_method: "get",
    });

    // Save order with status = pending
    const newOrder = new Order({
      name: userName,
      email: userEmail,
      phone: userPhone,
      amount: totalAmount,
      status: "pending",
      razorpay_payment_link_id: paymentLink.id,
    });

    await newOrder.save();

    return res.json({ paymentLink });
  } catch (err) {
    console.error("Payment link error:", err);
    res.status(500).json({ error: "Failed to get payment link" });
  }
});

module.exports = router;
