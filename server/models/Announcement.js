const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema({
  messages: { type: [String], default: [] },
  isActive: { type: Boolean, default: true },
});

const AnnouncementConfig = mongoose.model("AnnouncementConfig", announcementSchema);

module.exports = AnnouncementConfig;
