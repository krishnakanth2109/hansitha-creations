const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');

// ✅ POST /api/orders - create a new order & update stock
router.post('/', async (req, res) => {
  const session = await Product.startSession();

  try {
    const { email, address, cartItems, totalAmount } = req.body;

    // ✅ Input Validation
    if (!email || !address || !cartItems?.length || !totalAmount) {
      return res.status(400).json({ message: 'Missing required order fields' });
    }

    session.startTransaction();

    const updatedStocks = [];

    // ✅ Step 1: Reduce stock in a transaction
    for (const item of cartItems) {
      const product = await Product.findById(item._id).session(session);

      if (!product) {
        throw new Error(`Product with ID ${item._id} not found`);
      }

      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for "${product.name}". Available: ${product.stock}, Requested: ${item.quantity}`);
      }

      product.stock -= item.quantity;
      await product.save({ session });

      updatedStocks.push({
        productId: product._id,
        stock: product.stock,
      });
    }

    // ✅ Step 2: Save order in the same transaction
    const newOrder = new Order({
      email,
      address,
      cartItems,
      totalAmount,
    });

    const savedOrder = await newOrder.save({ session });

    // ✅ Step 3: Commit transaction
    await session.commitTransaction();

    // ✅ Step 4: Emit socket event if socket is configured
    const io = req.app.get('io');
    if (io) {
      io.emit('newOrder', {
        _id: savedOrder._id,
        email: savedOrder.email,
        totalAmount: savedOrder.totalAmount,
        createdAt: savedOrder.createdAt,
      });
    }

    // ✅ Step 5: Return response
    res.status(201).json({
      order: savedOrder,
      updatedStock: updatedStocks,
    });

  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ message: error.message || 'Failed to place order' });
    console.error('❌ Order transaction failed:', error.message);
  } finally {
    session.endSession(); // Ensures cleanup
  }
});

module.exports = router;
