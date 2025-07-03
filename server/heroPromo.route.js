const express = require('express');
const router = express.Router();
const HeroPromo = require('./heroPromo.model');
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Create new promo
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { title, subtitle, description, bgColor } = req.body;
    let imageUrl = '';

    if (req.file) {
      const base64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
      const result = await cloudinary.uploader.upload(base64, { folder: 'hero_promos' });
      imageUrl = result.secure_url;
    }

    const promo = new HeroPromo({ title, subtitle, description, bgColor, image: imageUrl });
    await promo.save();
    res.status(201).json(promo);
  } catch (err) {
    console.error('HeroPromo POST error:', err);
    res.status(500).json({ message: 'Failed to create promo' });
  }
});

router.get('/', async (req, res) => {
  const promos = await HeroPromo.find();
  res.json(promos);
});

router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (req.file) {
      const base64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
      const result = await cloudinary.uploader.upload(base64, { folder: 'hero_promos' });
      updateData.image = result.secure_url;
    }

    const updated = await HeroPromo.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updated);
  } catch (err) {
    console.error('HeroPromo PUT error:', err);
    res.status(500).json({ message: 'Failed to update promo' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await HeroPromo.findByIdAndDelete(req.params.id);
    res.json({ message: 'Promo deleted' });
  } catch (err) {
    console.error('HeroPromo DELETE error:', err);
    res.status(500).json({ message: 'Failed to delete promo' });
  }
});

module.exports = router;
