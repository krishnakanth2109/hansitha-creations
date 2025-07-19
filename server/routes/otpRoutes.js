const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const User = require("../models/User.model");

// ✅ Transporter config (make sure .env has correct values)
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASS,
  },
});

// In-memory OTP store (you may replace with DB/Redis)
const otpStore = new Map();

// ✅ Send OTP route
router.post("/request-otp", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = Date.now() + 10 * 60 * 1000;

    otpStore.set(email, { otp, expires });

    await transporter.sendMail({
      from: `"Hansitha Creations" <${process.env.SMTP_EMAIL}>`,
      to: email,
      subject: "Your OTP for Password Reset",
      html: `
        <h2>OTP Verification</h2>
        <p>Your OTP is: <strong>${otp}</strong></p>
        <p>This code will expire in 10 minutes.</p>
      `,
    });

    console.log("✅ OTP sent to:", email);
    res.json({ message: "OTP sent to email" });
  } catch (err) {
    console.error("❌ OTP Send Error:", err.message);
    res.status(500).json({ message: "Internal Server Error: Failed to send OTP" });
  }
});

// ✅ Verify OTP & Reset Password
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp, password } = req.body;
    if (!email || !otp || !password)
      return res.status(400).json({ message: "Missing fields" });

    const record = otpStore.get(email);

    if (!record || record.otp !== otp || Date.now() > record.expires) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    user.password = password; // Pre-save hook should hash it
    await user.save();

    otpStore.delete(email);
    console.log("✅ Password reset for", email);
    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error("❌ Password Reset Error:", err.message);
    res.status(500).json({ message: "Failed to reset password" });
  }
});

// ⏱️ Cleanup expired OTPs every 5 min
setInterval(() => {
  const now = Date.now();
  for (const [email, record] of otpStore.entries()) {
    if (record.expires < now) {
      otpStore.delete(email);
      console.log(`🧹 Cleaned expired OTP for: ${email}`);
    }
  }
}, 5 * 60 * 1000);

module.exports = router;
