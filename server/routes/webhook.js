const express = require("express");
const crypto = require("crypto");
const router = express.Router();
const Order = require("../models/Order"); // Adjust this path as per your structure

// ✅ Webhook Endpoint
router.post(
  "/webhook",
  express.json({ verify: verifySignature }),
  async (req, res) => {
    const event = req.body;

    console.log("🔔 Webhook Event Received:", event.event);

    if (event.event === "payment_link.paid") {
      const payment = event.payload.payment.entity;

      // You can use a unique ID, or customer email from notes
      const email = payment.notes?.email || payment.email;
      const paymentId = payment.id;

      try {
        const updatedOrder = await Order.findOneAndUpdate(
          { email, status: "pending" }, // Adjust the query if you store orderId in notes
          {
            $set: {
              status: "paid",
              paymentId,
              razorpayData: payment, // optional: to keep full record
            },
          },
          { new: true }
        );

        if (updatedOrder) {
          console.log("✅ Order marked as paid:", updatedOrder._id);
        } else {
          console.warn("⚠️ No matching pending order found for email:", email);
        }
      } catch (err) {
        console.error("❌ Error updating order:", err);
      }
    }

    res.status(200).json({ status: "received" });
  }
);

// ✅ Signature Verifier
function verifySignature(req, res, buf) {
  const signature = req.headers["x-razorpay-signature"];

  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
    .update(buf)
    .digest("hex");

  if (signature !== expected) {
    console.error("❌ Invalid Razorpay signature");
    throw new Error("Invalid webhook signature");
  }
}

module.exports = router;
