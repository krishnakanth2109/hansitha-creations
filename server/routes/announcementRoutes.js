const express = require("express");
const router = express.Router();
const Announcement = require("../models/Announcement");

// Get the announcement (assuming one document only)
router.get("/", async (req, res) => {
  try {
    let doc = await Announcement.findOne();
    if (!doc) {
      doc = await Announcement.create({ messages: [], isActive: true });
    }
    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch announcement" });
  }
});

// Update or create announcement
router.post("/", async (req, res) => {
  try {
    const { messages, isActive } = req.body;
    let doc = await Announcement.findOne();
    if (!doc) {
      doc = new Announcement({ messages, isActive });
    } else {
      doc.messages = messages;
      doc.isActive = isActive;
    }
    await doc.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to save announcement" });
  }
});

module.exports = router;
