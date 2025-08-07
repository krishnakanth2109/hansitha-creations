const express = require("express");
const crypto = require("crypto");
const Order = require("../models/Order");
const router = express.Router();

router.post("/webhook", express.json({ verify: verifySignature }), async (req, res) => {
  const event = req.body;

  if (event.event === "payment_link.paid") {
    const payment = event.payload.payment.entity;
    const paymentLinkId = payment.payment_link_id;

    // ✅ Update order status to paid
    try {
      const order = await Order.findOne({ razorpay_payment_link_id: paymentLinkId });

      if (order) {
        order.status = "paid";
        order.razorpay_payment_id = payment.id;
        await order.save();
        console.log("Order marked as paid:", order._id);
      } else {
        console.warn("Order not found for payment link:", paymentLinkId);
      }
    } catch (err) {
      console.error("Webhook DB update error:", err);
    }
  }

  res.status(200).json({ status: "received" });
});

function verifySignature(req, res, buf) {
  const signature = req.headers["x-razorpay-signature"];
  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
    .update(buf)
    .digest("hex");

  if (signature !== expected) {
    throw new Error("Invalid webhook signature");
  }
}

module.exports = router;
