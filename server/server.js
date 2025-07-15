const express = require("express");
const cors = require("cors");
const multer = require("multer");
const mongoose = require("mongoose");
const { v2: cloudinary } = require("cloudinary");
const dotenv = require("dotenv");
const Razorpay = require("razorpay");
const crypto = require("crypto");

// Routes
const categoryRoutes = require('./routes/categories');
const checkoutRoutes = require('./routes/checkoutRoutes');
const productRoutes = require('./routes/productRoutes');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

// Multer setup
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ✅ Razorpay config
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ✅ Razorpay Create Order
app.post('/api/payment/orders', async (req, res) => {
  try {
    const { amount } = req.body;
    const order = await razorpay.orders.create({
      amount,
      currency: 'INR',
      receipt: `receipt_order_${Date.now()}`
    });
    res.json(order);
  } catch (err) {
    console.error("Razorpay order error:", err);
    res.status(500).send('Error creating Razorpay order');
  }
});

// ✅ Razorpay Verify Payment
app.post('/api/payment/verify', async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  } = req.body;

  const generated_signature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  if (generated_signature === razorpay_signature) {
    return res.status(200).json({ success: true });
  } else {
    return res.status(400).json({ success: false, message: "Invalid signature" });
  }
});

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: 'web-store'
}).then(() => {
  console.log("✅ MongoDB connected");
}).catch(err => {
  console.error("❌ MongoDB connection error:", err);
});

app.get('/', (req, res) => {
  res.send('API is working');
});

// ✅ API Routes
app.use('/api/categories', categoryRoutes);
app.use('/api', checkoutRoutes); 
app.use('/api/products', productRoutes);

// ✅ Carousel Schema + Routes
const ImageSchema = new mongoose.Schema({
  carouselId: { type: String, required: true, unique: true },
  imageUrl: { type: String, default: "" },          // Desktop image
  mobileImageUrl: { type: String, default: "" },    // Mobile image
});
const ImageModel = mongoose.model("Image", ImageSchema);

// ✅ Upload Desktop and Mobile Carousel Images
app.post("/api/upload-carousel", upload.fields([
  { name: "image", maxCount: 1 },
  { name: "mobileImage", maxCount: 1 }
]), async (req, res) => {
  try {
    const { carouselId } = req.body;
    if (!carouselId) return res.status(400).json({ message: "Missing carouselId" });

    let existing = await ImageModel.findOne({ carouselId });
    if (!existing) existing = new ImageModel({ carouselId });

    if (req.files?.image?.[0]) {
      const base64 = `data:${req.files.image[0].mimetype};base64,${req.files.image[0].buffer.toString("base64")}`;
      const result = await cloudinary.uploader.upload(base64, {
        folder: "carousel_images",
      });
      existing.imageUrl = result.secure_url;
    }

    if (req.files?.mobileImage?.[0]) {
      const base64 = `data:${req.files.mobileImage[0].mimetype};base64,${req.files.mobileImage[0].buffer.toString("base64")}`;
      const result = await cloudinary.uploader.upload(base64, {
        folder: "carousel_images/mobile",
      });
      existing.mobileImageUrl = result.secure_url;
    }

    await existing.save();
    res.json({ success: true, message: "Carousel updated successfully." });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ success: false, message: "Upload failed", error: err.message });
  }
});

// ✅ Delete Carousel
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

// ✅ Fetch Carousel Images
app.get("/api/carousel-images", async (req, res) => {
  try {
    const images = await ImageModel.find({});
    res.json(images);
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ message: "Failed to load images" });
  }
});

// ✅ Newsletter
const NewsletterSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  subscribedAt: { type: Date, default: Date.now },
});
const Newsletter = mongoose.model("Newsletter", NewsletterSchema);

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

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
