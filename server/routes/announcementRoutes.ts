// routes/announcementRoutes.ts
import express from "express";
import { Announcement } from "../models/Announcement";

const router = express.Router();

// GET - Fetch announcement settings
router.get("/", async (req, res) => {
  const data = await Announcement.findOne();
  if (!data) return res.json({ messages: [], isActive: true });
  res.json(data);
});

// POST - Save messages and active status
router.post("/", async (req, res) => {
  const { messages, isActive } = req.body;

  let data = await Announcement.findOne();
  if (!data) {
    data = new Announcement({ messages, isActive });
  } else {
    data.messages = messages;
    data.isActive = isActive;
  }
  await data.save();
  res.json({ success: true });
});

export default router;
