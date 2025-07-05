const express = require("express");
const cors = require("cors");
const multer = require("multer");
const mongoose = require("mongoose");
const { v2: cloudinary } = require("cloudinary");
const dotenv = require("dotenv");
dotenv.config();

const app = express();

// Import routes and controllers
const heroPromoRoutes = require("./heroPromo.route");
const productRoutes = require("./product.route");
const orderRoutes = require("./routes/orderRoutes");

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/products", productRoutes);
app.use("/api/hero-promos", heroPromoRoutes);
app.use("/api/orders", orderRoutes); // <-- Order email handling

// MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

// Multer
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Carousel Schema
const ImageSchema = new mongoose.Schema({
  carouselId: { type: String, required: true, unique: true },
  imageUrl: { type: String, default: "" },
  heading: { type: String, default: "" },
  subtext: { type: String, default: "" },
});
const ImageModel = mongoose.model("Image", ImageSchema);

// Carousel Upload
app.post("/api/upload-carousel", upload.single("image"), async (req, res) => {
  try {
    const { carouselId, heading, subtext } = req.body;
    if (!carouselId)
      return res.status(400).json({ message: "Missing carouselId" });

    let existing = await ImageModel.findOne({ carouselId });
    if (!existing) existing = new ImageModel({ carouselId });

    if (req.file) {
      const base64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
      const result = await cloudinary.uploader.upload(base64, {
        folder: "carousel_images",
      });
      existing.imageUrl = result.secure_url;
    }

    if (heading) existing.heading = heading;
    if (subtext) existing.subtext = subtext;

    await existing.save();
    res.json({ success: true, message: "Carousel updated successfully." });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ success: false, message: "Upload failed", error: err.message });
  }
});

// Carousel Delete
app.delete("/api/delete-carousel/:carouselId", async (req, res) => {
  try {
    const { carouselId } = req.params;
    const deleted = await ImageModel.findOneAndDelete({ carouselId });
    if (!deleted)
      return res.status(404).json({ success: false, message: "Carousel not found" });

    res.json({ success: true, message: "Carousel deleted successfully." });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ success: false, message: "Failed to delete carousel" });
  }
});

// Get carousel images
app.get("/api/carousel-images", async (req, res) => {
  try {
    const images = await ImageModel.find({});
    res.json(images);
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ message: "Failed to load images" });
  }
});

// Newsletter Schema
const NewsletterSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  subscribedAt: { type: Date, default: Date.now },
});
const Newsletter = mongoose.model("Newsletter", NewsletterSchema, "Newsletters");

app.post("/api/newsletter", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  try {
    const exists = await Newsletter.findOne({ email });
    if (exists) {
      return res.status(409).json({ message: "Email already subscribed" });
    }

    const newEntry = new Newsletter({ email });
    await newEntry.save();
    res.status(201).json({ message: "Subscribed successfully" });
  } catch (err) {
    console.error("Newsletter error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
