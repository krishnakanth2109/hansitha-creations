const express = require("express");
const router = express.Router();
const AnnouncementConfig = require("../models/Announcement");

// GET: Fetch announcement settings
router.get("/", async (req, res) => {
  try {
    let config = await AnnouncementConfig.findOne();
    if (!config) {
      config = await AnnouncementConfig.create({ messages: [], isActive: true });
    }
    res.json(config);
  } catch (err) {
    console.error("❌ Error fetching announcement config:", err);
    res.status(500).json({ error: "Failed to fetch announcement config" });
  }
});

// POST: Save announcement settings
router.post("/", async (req, res) => {
  try {
    const { messages, isActive } = req.body;

    if (!Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages must be an array" });
    }

    let config = await AnnouncementConfig.findOne();
    if (!config) {
      config = new AnnouncementConfig();
    }

    config.messages = messages;
    config.isActive = isActive;
    await config.save();

    res.json({ success: true });
  } catch (err) {
    console.error("❌ Error saving announcement config:", err);
    res.status(500).json({ error: "Failed to save announcement config" });
  }
});

module.exports = router;
