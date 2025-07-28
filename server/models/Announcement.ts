// models/Announcement.ts
import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema({
  messages: [String],
  isActive: { type: Boolean, default: true },
});

export const Announcement = mongoose.model("Announcement", announcementSchema);
