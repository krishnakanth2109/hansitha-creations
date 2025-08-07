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

// Add this to your Express route file (e.g., routes/checkout.js)
const Razorpay = require("razorpay");

router.post("/checkout/payment-link", async (req, res) => {
  const { amount, customer } = req.body;

  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const paymentLink = await razorpay.paymentLink.create({
      amount: amount * 100,
      currency: "INR",
      accept_partial: false,
      description: "Hansitha Creations Order Payment",
      customer: {
        name: customer.name,
        contact: customer.phone,
        email: customer.email,
      },
      notify: { sms: true, email: true },
      reminder_enable: true,
      callback_url: "http://localhost:8080/order-confirmation",
      callback_method: "get",
    });

    res.json({ url: paymentLink.short_url });
  } catch (err) {
    console.error("Payment link error:", err);
    res.status(500).json({ error: "Failed to create payment link" });
  }
});


module.exports = router;
