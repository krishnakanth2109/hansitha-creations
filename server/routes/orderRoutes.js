const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');

const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET;

// ✅ GET all orders (newest first)
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

// ✅ Razorpay webhook - only create order after payment success
router.post('/webhook', express.json({ type: '*/*' }), async (req, res) => {
  const signature = req.headers['x-razorpay-signature'];

  // Verify webhook signature
  const expectedSignature = crypto
    .createHmac('sha256', RAZORPAY_WEBHOOK_SECRET)
    .update(JSON.stringify(req.body))
    .digest('hex');

  if (signature !== expectedSignature) {
    console.error('❌ Invalid Razorpay signature');
    return res.status(400).json({ message: 'Invalid signature' });
  }

  const event = req.body.event;

  if (event === 'payment.captured') {
    try {
      // Payment notes from Razorpay order creation
      const notes = req.body.payload.payment.entity.notes;

      const email = notes.email;
      const address = JSON.parse(notes.address);
      const cartItems = JSON.parse(notes.cartItems);
      const totalAmount = Number(notes.totalAmount);

      // Step 1: Update stock
      const updatedStocks = [];
      for (const item of cartItems) {
        const product = await Product.findById(item.id);

        if (!product) {
          console.error(`Product ${item.id} not found`);
          continue;
        }

        if (product.stock < item.quantity) {
          console.error(`Insufficient stock for ${product.name}`);
          continue;
        }

        product.stock -= item.quantity;
        await product.save();

        updatedStocks.push({ productId: product._id, stock: product.stock });
      }

      // Step 2: Save order
      const newOrder = new Order({
        email,
        address,
        cartItems,
        totalAmount,
      });

      const savedOrder = await newOrder.save();

      // Step 3: Emit socket event to admins
      const io = req.app.get('io');
      if (io) {
        io.emit('newOrder', {
          _id: savedOrder._id,
          email: savedOrder.email,
          totalAmount: savedOrder.totalAmount,
          createdAt: savedOrder.createdAt,
        });
      }

      console.log('✅ Order created after payment:', savedOrder._id);
      return res.status(200).json({ success: true, updatedStock: updatedStocks });

    } catch (error) {
      console.error('Error creating order from webhook:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  }

  // If event is not payment.captured
  res.status(200).json({ message: 'Webhook received but no order created' });
});

module.exports = router;
