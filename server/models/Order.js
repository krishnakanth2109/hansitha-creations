const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  amount: Number,
  status: {
    type: String,
    enum: ["pending", "paid", "failed"],
    default: "pending",
  },
  products: [
    {
      id: String,
      name: String,
      image: String,
      price: Number,
      quantity: Number,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Order", orderSchema);
