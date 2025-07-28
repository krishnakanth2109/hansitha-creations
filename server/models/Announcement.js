const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema({
  messages: [String],
  isActive: { type: Boolean, default: true },
});

const Announcement = mongoose.model("Announcement", announcementSchema);

module.exports = { Announcement };
