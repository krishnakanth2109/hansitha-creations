const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  name: String,
  email: String,
  address: String,
  city: String,
  postalCode: String,
  country: String,
  cartItems: Array,
  totalAmount: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Order', OrderSchema);
