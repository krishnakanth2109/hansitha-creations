const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const User = require("../models/User.model");

// ✅ Email config (make sure .env is set up correctly)
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASS,
  },
});

// In-memory OTP store (you can replace with Redis if needed)
const otpStore = new Map();

// ✅ Send OTP route
router.post("/request-otp", async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore.set(email, { otp, expires: Date.now() + 10 * 60 * 1000 }); // expires in 10 minutes

  try {
    await transporter.sendMail({
      from: `"Hansitha Creations" <${process.env.SMTP_EMAIL}>`,
      to: email,
      subject: "Your OTP for Password Reset",
      html: `<h3>Your OTP is: <strong>${otp}</strong></h3><p>Expires in 10 minutes.</p>`,
    });

    console.log("✅ OTP sent to:", email);
    res.json({ message: "OTP sent to email" });
  } catch (err) {
    console.error("❌ Email error:", err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
});

// ✅ Verify OTP & Reset Password
router.post("/verify-otp", async (req, res) => {
  const { email, otp, password } = req.body;
  const record = otpStore.get(email);

  if (!record || record.otp !== otp || Date.now() > record.expires) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    user.password = password; // Will be hashed by pre-save hook
    await user.save();

    otpStore.delete(email);
    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error("❌ Reset error:", err);
    res.status(500).json({ message: "Failed to reset password" });
  }
});

// ⏱️ Auto-cleanup expired OTPs every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [email, record] of otpStore.entries()) {
    if (record.expires < now) {
      otpStore.delete(email);
      console.log(`🧹 Expired OTP for ${email} cleaned up`);
    }
  }
}, 5 * 60 * 1000); // every 5 minutes


module.exports = router;
