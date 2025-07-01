const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  rating: { type: Number, required: true },
  reviews: { type: Number, required: true },
  featured: { type: Boolean, default: false },
});

module.exports = mongoose.model('Product', productSchema);
