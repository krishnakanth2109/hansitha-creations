// server/models/Announcement.js
const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema({
  message: { type: String, required: true },
});

const announcementSettingsSchema = new mongoose.Schema({
  isActive: { type: Boolean, default: true },
});

const Announcement = mongoose.model("Announcement", announcementSchema);
const AnnouncementSettings = mongoose.model("AnnouncementSettings", announcementSettingsSchema);

module.exports = { Announcement, AnnouncementSettings };
