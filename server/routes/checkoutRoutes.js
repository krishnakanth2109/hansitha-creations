const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const Razorpay = require("razorpay");
require("dotenv").config(); // Load environment variables

router.post("/payment-link", async (req, res) => {
  const { amount, customer, cartItems } = req.body;

  try {
    // ✅ Save order to MongoDB
    const newOrder = new OrderModel({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      amount,
      cartItems, // Save cart data
      status: "pending",
      createdAt: new Date(),
    });

    const savedOrder = await newOrder.save();
    console.log("Order saved:", savedOrder._id);

    // ✅ Create Razorpay Payment Link
    const paymentLink = await razorpay.paymentLink.create({
      amount: amount * 100, // Razorpay expects paise
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
      callback_url: `${process.env.FRONTEND_URL}/order-success`,
      callback_method: "get",
    });

    return res.json({ url: paymentLink.short_url });
  } catch (err) {
    console.error("Error in payment-link route:", err);
    return res.status(500).json({ error: "Something went wrong" });
  }
});

// ✅ Razorpay Payment Link Generator
router.post("/checkout/payment-link", async (req, res) => {
  const { amount, customer } = req.body;

  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const paymentLink = await razorpay.paymentLink.create({
      amount: amount * 100, // convert rupees to paise
      currency: "INR",
      accept_partial: false,
      description: "Hansitha Creations Order Payment",
      customer: {
        name: customer.name,
        contact: customer.phone,
        email: customer.email,
      },
      notify: {
        sms: true,
        email: true,
      },
      reminder_enable: true,

      // ✅ Make sure FRONTEND_URL is set correctly in your .env file
      callback_url: `${process.env.FRONTEND_URL}/order-confirmation`,
      callback_method: "get",
    });

    res.json({ url: paymentLink.short_url });
  } catch (err) {
    console.error("❌ Payment link error:", err);
    res.status(500).json({ error: "Failed to create payment link" });
  }
});

module.exports = router;
