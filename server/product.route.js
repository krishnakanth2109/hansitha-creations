const express = require('express');
const router = express.Router();
const Product = require('./product.model');

// GET all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// GET featured products
router.get('/featured', async (req, res) => {
  try {
    const featured = await Product.find({ featured: true });
    res.json(featured);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch featured products' });
  }
});

// ✅ POST new product
router.post('/', async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    const saved = await newProduct.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('Failed to save product:', err);
    res.status(500).json({ error: 'Failed to add product' });
  }
});

module.exports = router;
