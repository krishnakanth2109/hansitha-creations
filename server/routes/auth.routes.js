const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User.model.js");

const router = express.Router();

// ✅ Register Route
router.post("/register", async (req, res) => {
  try {
    if (!req.body) return res.status(400).json({ message: "Missing request body" });

    const { email, password, name } = req.body;
    if (!email || !password || !name) return res.status(400).json({ message: "All fields are required" });

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashed, name });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "Lax",
        secure: process.env.NODE_ENV === "production", // only secure in production
      })
      .json({ id: user._id, name: user.name, email: user.email });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Server error during registration" });
  }
});

// ✅ Login Route
router.post("/login", async (req, res) => {
  try {
    console.log("Login request body:", req.body); // ✅ Debugging log

    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password are required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "Lax",
        secure: process.env.NODE_ENV === "production",
      })
      .json({ id: user._id, name: user.name, email: user.email });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
});

// ✅ Logout Route
router.post("/logout", (req, res) => {
  res.clearCookie("token").json({ message: "Logged out successfully" });
});

module.exports = router;
