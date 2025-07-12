const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// POST: Create new product
router.post('/', async (req, res) => {
  try {
    const { name, price, stock, image, category, description, featured } = req.body;

    console.log('📦 Incoming product payload:', req.body);

    // Basic validation
    if (!name || !price || !stock || !image || !category || !description) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newProduct = new Product({
      name,
      price,
      stock,
      image,
      category,
      description,
      featured: featured || false,
    });

    const saved = await newProduct.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('❌ Error creating product:', err.message, err.stack);
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
});

// GET: All products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error('❌ Error fetching products:', err);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
});

// PUT: Update product
router.put('/:id', async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    console.error('❌ Error updating product:', err);
    res.status(500).json({ message: 'Update failed' });
  }
});

// DELETE: Delete product
router.delete('/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    console.error('❌ Error deleting product:', err);
    res.status(500).json({ message: 'Delete failed' });
  }
});

module.exports = router;
