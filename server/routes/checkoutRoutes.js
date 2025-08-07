const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const Razorpay = require("razorpay");
const Order = require("../models/Order");

require("dotenv").config(); // Load environment variables

router.post("/payment-link", async (req, res) => {
  const { amount, customer, cartItems } = req.body;

  try {
    // ✅ Save order to MongoDB
    const newOrder = new Order({
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
      callback_url: `${process.env.FRONTEND_URL}/order-confirmation`,
      callback_method: "get",
    });

    return res.json({ url: paymentLink.short_url });
  } catch (err) {
    console.error("Error in payment-link route:", err);
    return res.status(500).json({ error: "Something went wrong" });
  }
});

module.exports = router;
