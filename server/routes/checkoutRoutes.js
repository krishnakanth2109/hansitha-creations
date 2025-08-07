// routes/checkout.js
const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const Razorpay = require("razorpay");
require("dotenv").config(); // Ensure environment variables are loaded

// ✅ Save Order Endpoint
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

    const user = await User.findOne({ email: userId });
    if (!user) return res.status(404).json({ message: "User not found" });

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

    user.orders.push(newOrder);
    await user.save();

    res.status(201).json({ message: "Order saved successfully" });
  } catch (err) {
    console.error("❌ Error saving order:", err);
    res.status(500).json({ message: "Failed to save order" });
  }
});

// ✅ Razorpay Payment Link Endpoint
router.post("/checkout/payment-link", async (req, res) => {
  const { amount, customer } = req.body;

  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const paymentLink = await razorpay.paymentLink.create({
      amount: amount * 100, // convert to paise
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

      // ⚠️ Use proper domain instead of localhost for callback_url
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
