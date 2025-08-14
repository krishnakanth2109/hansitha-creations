// Core Dependencies & Models
const express = require("express");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User.model.js"); // Make sure this path is correct
const sendEmail = require("../utils/sendEmail.js");
const authMiddleware = require("../middleware/auth");
const router = express.Router();

// ✅ NEW: Import Google Auth Library
const { OAuth2Client } = require('google-auth-library');

// ✅ NEW: Initialize Google OAuth Client
// IMPORTANT: Make sure VITE_GOOGLE_CLIENT_ID is in your backend's .env file!
const client = new OAuth2Client(process.env.VITE_GOOGLE_CLIENT_ID);


// -----------------------------
// 🔒 Token Generator (Existing function, no changes)
// -----------------------------
const generateToken = (user) =>
  jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

// -----------------------------
// ✅ GET /api/auth/me (Existing route, no changes)
// -----------------------------
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate("wishlist")
      .populate("cart.product")
      .select("-password");
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// -----------------------------
// ✅ POST /api/auth/register (Existing route, no changes)
// -----------------------------
router.post("/register", async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name)
      return res.status(400).json({ success: false, message: "All fields are required" });

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ success: false, message: "Email already exists" });

    const user = await User.create({ email, password, name });
    const token = generateToken(user);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      user: { _id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("🔴 Register error:", err.message);
    res.status(500).json({
      success: false,
      message: "Server error during registration",
    });
  }
});

// -----------------------------
// ✅ POST /api/auth/login (Existing route, no changes)
// -----------------------------
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: "Email and password are required" });

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ success: false, message: "Invalid credentials" });

    const token = generateToken(user);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("🔴 Login error:", err.message);
    res.status(500).json({
      success: false,
      message: "Login failed due to server error",
    });
  }
});

// =================================================================
// ⭐ NEW: GOOGLE LOGIN ROUTE
// =================================================================
router.post('/google-login', async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ success: false, message: 'Google token not provided.' });
  }

  try {
    // Verify the ID token sent from the frontend
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.VITE_GOOGLE_CLIENT_ID, // This MUST match the Client ID used on the frontend
    });

    const { name, email } = ticket.getPayload();
    
    let user = await User.findOne({ email });

    // If the user does not exist, create them in the database
    if (!user) {
      console.log(`User with email ${email} not found. Creating new user.`);
      // Note: This creates a user without a password. Your User model must allow this.
      user = await User.create({ email, name });
    }

    // At this point, the user exists. Generate a session token for them.
    const sessionToken = generateToken(user);

    // Set the session token in the cookie, same as your regular login
    res.cookie("token", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none", // Using 'none' to allow cross-site cookies
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Send a success response with the user data
    res.json({
      success: true,
      message: "Google login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    // This will catch any errors from Google's token verification
    console.error('🔴 BACKEND GOOGLE AUTH ERROR:', error);
    res.status(401).json({ success: false, message: 'Google authentication failed. Invalid token.' });
  }
});


// -----------------------------
// ✅ POST /api/auth/logout (Existing route, no changes)
// -----------------------------
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ success: true, message: "Logged out successfully" });
});

// -----------------------------
// ✅ POST /api/auth/forgot-password (Existing route, no changes)
// -----------------------------
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email)
      return res.status(400).json({ success: false, message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    const token = crypto.randomBytes(32).toString("hex");
    user.resetToken = token;
    user.resetTokenExpire = Date.now() + 15 * 60 * 1000;
    await user.save();

    const resetLink = `${process.env.CLIENT_URL}/reset-password/${token}`;
    const html = `
      <p>Hello ${user.name || "User"},</p>
      <p>You requested a password reset.</p>
      <p>Click the link below to reset your password (valid for 15 minutes):</p>
      <a href="${resetLink}" style="color:#6B46C1;">${resetLink}</a>
      <p>If you didn't request this, you can ignore this email.</p>
    `;

    await sendEmail(user.email, "Reset Your Password", html);

    res.json({ success: true, message: "Reset link sent to your email" });
  } catch (err) {
    console.error("🔴 Forgot Password error:", err.message);
    res.status(500).json({ success: false, message: "Failed to send reset link" });
  }
});

// -----------------------------
// ✅ POST /api/auth/reset-password/:token (Existing route, no changes)
// -----------------------------
router.post("/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpire: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ success: false, message: "Invalid or expired token" });

    user.password = password;
    user.resetToken = undefined;
    user.resetTokenExpire = undefined;
    await user.save();

    res.json({ success: true, message: "Password has been reset" });
  } catch (err) {
    console.error("🔴 Reset Password error:", err.message);
    res.status(500).json({ success: false, message: "Failed to reset password" });
  }
});

module.exports = router;