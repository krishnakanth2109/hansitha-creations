// server/routes/announcementRoutes.js
const express = require("express");
const { Announcement, AnnouncementSettings } = require("../models/Announcement");

const router = express.Router();

// GET announcements
router.get("/", async (req, res) => {
  try {
    const messages = await Announcement.find().lean();
    const settings = await AnnouncementSettings.findOne().lean();
    res.json({
      messages: messages.map((m) => m.message),
      isActive: settings?.isActive ?? true,
    });
  } catch (err) {
    console.error("❌ Fetch error:", err);
    res.status(500).json({ error: "Failed to fetch announcements" });
  }
});

// POST announcements
router.post("/", async (req, res) => {
  try {
    const { messages, isActive } = req.body;

    if (!Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid messages format" });
    }

    await Announcement.deleteMany({});
    await Announcement.insertMany(messages.map((m) => ({ message: m })));

    await AnnouncementSettings.findOneAndUpdate(
      {},
      { isActive },
      { upsert: true, new: true }
    );

    res.json({ success: true });
  } catch (err) {
    console.error("❌ Save error:", err);
    res.status(500).json({ error: "Failed to save announcements" });
  }
});

module.exports = router;
