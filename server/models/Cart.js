// models/Cart.js
import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  items: [
    {
      productId: String,
      name: String,
      price: Number,
      image: String,
      quantity: Number,
    },
  ],
});

export default mongoose.model('Cart', cartSchema);
