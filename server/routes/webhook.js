const express = require("express");
const crypto = require("crypto");
const router = express.Router();

router.post("/webhook", express.json({ verify: verifySignature }), async (req, res) => {
  const event = req.body;

  if (event.event === "payment_link.paid") {
    const payment = event.payload.payment.entity;

    // Save order in DB (payment.customer_email / amount / items etc.)
    console.log("Payment successful:", payment);
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
