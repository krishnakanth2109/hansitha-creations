const express = require("express");
const cors = require("cors");
const multer = require("multer");
const mongoose = require("mongoose");
const { v2: cloudinary } = require("cloudinary");
const dotenv = require("dotenv");
require('dotenv').config();


const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB connection error:", err));



const ImageSchema = new mongoose.Schema({
  carouselId: { type: String, required: true, unique: true },
  imageUrl: { type: String, default: "" },
  heading: { type: String, default: "" },
  subtext: { type: String, default: "" },
});

const ImageModel = mongoose.model("Image", ImageSchema);

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

// Multer config
const storage = multer.memoryStorage();
const upload = multer({ storage });

app.post("/api/upload-carousel", upload.single("image"), async (req, res) => {
  try {
    const { carouselId, heading, subtext } = req.body;

    if (!carouselId) {
      return res.status(400).json({ message: "Missing carouselId" });
    }

    // Find existing carousel by ID
    let existing = await ImageModel.findOne({ carouselId });

    // Create a new one if doesn't exist
    if (!existing) {
      existing = new ImageModel({ carouselId });
    }

    // Upload image to Cloudinary (if provided)
    if (req.file) {
      const base64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
      const result = await cloudinary.uploader.upload(base64, {
        folder: "carousel_images",
      });
      existing.imageUrl = result.secure_url;
    }

    // Update heading and subtext if provided
    if (heading) existing.heading = heading;
    if (subtext) existing.subtext = subtext;

    await existing.save();

    res.json({ success: true, message: "Carousel updated successfully." });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ success: false, message: "Upload failed", error: err.message });
  }
});

app.delete("/api/delete-carousel/:carouselId", async (req, res) => {
  try {
    const { carouselId } = req.params;
    const deleted = await ImageModel.findOneAndDelete({ carouselId });

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Carousel not found" });
    }

    res.json({ success: true, message: "Carousel deleted successfully." });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ success: false, message: "Failed to delete carousel" });
  }
});



app.get("/api/carousel-images", async (req, res) => {
  const images = await ImageModel.find({});
  res.json(images);
});


app.listen(5000, () => console.log("Server started on http://localhost:5000"));
