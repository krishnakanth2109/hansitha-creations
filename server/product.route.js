const express = require('express');
const router = express.Router();
const Product = require('../models/product.model'); // Make sure this path is correct

// Create Product
router.post('/', async (req, res) => {
  try {
    const { name, price, image, rating, reviews, featured, category, stock } = req.body;

    const product = new Product({
      name,
      price,
      image,
      rating,
      reviews,
      featured,
      category,
      stock,
    });

    const saved = await product.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('Create error:', err);
    res.status(500).json({ message: 'Failed to create product' });
  }
});

// Get All Products
router.get('/', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// Update Product
router.put('/:id', async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ message: 'Failed to update product' });
  }
});

// Delete Product
router.delete('/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ message: 'Failed to delete product' });
  }
});

module.exports = router;
