import { sendOrderConfirmationEmail } from '../utils/email/sendOrderConfirmationEmail';

// src/server/controllers/orderController.js

exports.placeOrder = async (req, res) => {
  try {
    const { products } = req.body;
    console.log('Order Received:', products);
    // Here you could save to DB, send emails, etc.
    res.status(200).json({ message: 'Order placed successfully' });
  } catch (error) {
    console.error('Order failed:', error);
    res.status(500).json({ message: 'Failed to place order' });
  }
};

