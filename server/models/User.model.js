const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: String,
  address: String,
  cart: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: Number,
    }
  ],
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  orders: [
    {
      products: [
        {
          productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
          quantity: Number,
        }
      ],
      total: Number,
      createdAt: { type: Date, default: Date.now },
    }
  ]
}, { timestamps: true });

// 🔐 Hash password before save
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// 🔐 Compare password method
userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
