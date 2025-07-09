const Order = require('../models/order.model');
const { sendOrderConfirmationEmail } = require('../utils/emailService');

exports.placeOrder = async (req, res) => {
  try {
    const { userId, products } = req.body;

    if (!userId || !products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: 'Invalid order data' });
    }

    const newOrder = new Order({ userId, products });
    await newOrder.save();

    // Send confirmation email
    await sendOrderConfirmationEmail(userId, products);

    res.status(200).json({ message: 'Order placed successfully' });
  } catch (err) {
    console.error('Order placement error:', err);
    res.status(500).json({ message: 'Failed to place order' });
  }
};
