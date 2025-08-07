const Order = require("../models/Order");
const User = require("../models/User");

const placeOrder = async (req, res) => {
  const { name, email, phone, amount, products, userId, razorpayPaymentId, razorpayOrderId } = req.body;

  try {
    // Save order in the Order collection
    const newOrder = await Order.create({
      name,
      email,
      phone,
      amount,
      status: "paid",
      products,
    });

    // Save order summary in the User model
    if (userId) {
      const user = await User.findById(userId);
      if (user) {
        user.orders.push({
          products: products.map((p) => ({
            product: p.id, // Ensure `p.id` is a valid Product _id
            quantity: p.quantity,
          })),
          total: amount,
          paymentId: razorpayPaymentId || "",
          razorpayOrderId: razorpayOrderId || "",
        });

        // Optionally clear user's cart after order
        user.cart = [];
        await user.save();
      }
    }

    res.status(201).json({ success: true, order: newOrder });
  } catch (err) {
    console.error("Order save error:", err);
    res.status(500).json({ success: false, error: "Failed to place order." });
  }
};

module.exports = { placeOrder };
