const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  amount: Number,
  status: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  cartItems: [
    {
      id: String,
      name: String,
      image: String,
      price: Number,
      quantity: Number,
    },
  ],
});

module.exports = mongoose.model("Order", orderSchema);
