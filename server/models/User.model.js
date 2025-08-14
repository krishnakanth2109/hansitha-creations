const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// 1. DEFINE THE ADDRESS SCHEMA FIRST
// This schema describes the structure of a single address.
const AddressSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    houseNumber: { type: String, required: true, trim: true },
    street: { type: String, required: true, trim: true },
    landmark: { type: String, trim: true },
    area: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    pincode: { type: String, required: true, trim: true },
});


// 2. DEFINE THE MAIN USER SCHEMA
const userSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true 
    },
    email: { 
      type: String, 
      required: true, 
      unique: true 
    },
    // Password is not required to allow for social logins (e.g., Google)
    password: { 
      type: String, 
      required: false 
    },
    role: {
      type: String,
      enum: ["user", "admin", "superadmin"], // Added superadmin as a potential role
      default: "user",
    },
    // An array to hold the user's saved addresses
    addresses: [AddressSchema], // Use the AddressSchema defined above

    // Cart and Wishlist are correctly defined here as they belong to the user
    cart: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number, default: 1 },
      },
    ],
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    
    // NOTE: Order-specific fields like 'products', 'total', etc., have been removed.
    // They should be part of your 'Order' model, which would link back to the user via a 'user' field.
    // Example in Order.model.js: user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);


// 3. MIDDLEWARE & METHODS

// Hash password before saving (only if it exists and is modified)
userSchema.pre("save", async function (next) {
  // This logic is correct: only hash if a password exists and has been changed.
  if (!this.isModified("password") || !this.password) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Compare raw password with hashed password
userSchema.methods.comparePassword = async function (candidatePassword) {
  // This logic is correct: returns false if the user has no password (e.g., social login).
  if (!this.password) {
    return false;
  }
  return bcrypt.compare(candidatePassword, this.password);
};

// Clean up associated Orders when a User is deleted
// Ensure your Order model is named 'Order' for this to work.
userSchema.pre('remove', async function(next) {
    try {
        await this.model('Order').deleteMany({ user: this._id });
        next();
    } catch (err) {
        next(err);
    }
});


// 4. EXPORT THE MODEL
module.exports = mongoose.model("User", userSchema);