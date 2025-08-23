const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User.model');
const Product = require('../models/Product');
const auth = require('../middleware/auth'); // Middleware for security
const { createShiprocketOrder, assignCourierAndGetAwb } = require('../services/shiprocketService');

const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET;

// ✅ GET A SINGLE ORDER BY ITS ID (ESSENTIAL FOR FRONTEND POLLING)
// This route allows the TrackingOrders.tsx page to fetch the latest order status.
router.get('/:orderId', auth, async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId);
        
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        
        // Security Check: Ensure the user requesting the order is the one who owns it.
        if (order.user.toString() !== req.user.id) {
             return res.status(403).json({ message: 'User not authorized to view this order' });
        }
        
        res.json(order);
    } catch (error) {
        console.error(`Error fetching order ${req.params.orderId}:`, error);
        res.status(500).json({ message: 'Server Error' });
    }
});


// ✅ RAZORPAY WEBHOOK (UPDATED WITH CART CLEARING LOGIC)
router.post('/webhook', express.json({ type: '*/*' }), async (req, res) => {
  const signature = req.headers['x-razorpay-signature'];
  const expectedSignature = crypto
    .createHmac('sha256', RAZORPAY_WEBHOOK_SECRET)
    .update(JSON.stringify(req.body))
    .digest('hex');

  if (signature !== expectedSignature) {
    console.error('❌ Invalid Razorpay signature');
    return res.status(400).json({ message: 'Invalid signature' });
  }

  const event = req.body.event;

  if (event === 'payment_link.paid') {
    try {
      const paymentEntity = req.body.payload.payment_link.entity;
      const orderId = paymentEntity.notes.internal_order_id;

      if (!orderId) {
        console.error('Webhook Error: internal_order_id not found in notes.');
        return res.status(400).json({ message: 'Order ID missing from webhook.' });
      }

      // --- Step 1: Find and Update the Order ---
      const order = await Order.findById(orderId);
      if (!order) {
        console.error(`Webhook Error: Order with ID ${orderId} not found.`);
        return res.status(404).json({ message: 'Order not found' });
      }

      order.paymentStatus = 'paid';
      order.adminStatus = 'pending';
      order.status = 'Placed';
      await order.save();
      console.log(`[Webhook] Order ${orderId} status updated to 'paid'.`);
      
      // --- Step 2: Clear the User's Cart in the Database ---
      if (order.user) {
        await User.findByIdAndUpdate(order.user, { $set: { cart: [] } });
        console.log(`[Webhook] Cleared cart for user ${order.user}.`);
      }

      // --- Step 3: Trigger Shiprocket Order Creation ---
      console.log(`🚀 [Shiprocket] Creating shipment for order ${orderId}...`);
      const shiprocketOrder = await createShiprocketOrder(order);
      const awbData = await assignCourierAndGetAwb(shiprocketOrder.shipment_id);

      // --- Step 4: Save Shipment Details to the Order ---
      order.shipmentDetails = {
          shiprocketOrderId: shiprocketOrder.order_id,
          shipmentId: shiprocketOrder.shipment_id,
          status: awbData.data.status,
          awbCode: awbData.data.awb_code,
          courierName: awbData.data.courier_name,
      };
      await order.save();
      console.log(`✅ [Shiprocket] AWB ${awbData.data.awb_code} assigned to order ${orderId}.`);

      // Emit socket event to notify admin dashboard
      const io = req.app.get('io');
      if (io) io.emit('newOrder', order);

      return res.status(200).json({ success: true, message: "Order processed and shipment created." });

    } catch (error) {
      console.error('Error processing webhook:', error);
      // Optional: Add logic here to re-increment stock if Shiprocket/DB fails
      return res.status(500).json({ message: 'Server error during webhook processing' });
    }
  }

  res.status(200).json({ message: 'Webhook received but no action taken for this event.' });
});

module.exports = router;