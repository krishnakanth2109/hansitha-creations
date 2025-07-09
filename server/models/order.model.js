const mongoose = require('mongoose');

const OrderedProductSchema = new mongoose.Schema({
  name: String,
  price: Number,
  quantity: Number,
});

const OrderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  products: [OrderedProductSchema],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', OrderSchema);
