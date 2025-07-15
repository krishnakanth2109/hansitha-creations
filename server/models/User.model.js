const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: String,
  address: String,
  cart: [{ productId: mongoose.Schema.Types.ObjectId, quantity: Number }],
  wishlist: [mongoose.Schema.Types.ObjectId],
  orders: [{
    products: [{ productId: mongoose.Schema.Types.ObjectId, quantity: Number }],
    total: Number,
    createdAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
