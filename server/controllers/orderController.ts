import { sendOrderConfirmationEmail } from '../utils/email/sendOrderConfirmationEmail';

export const placeOrder = async (req, res) => {
  const userId = req.auth?.userId;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { products } = req.body;

  if (!products || !Array.isArray(products)) {
    return res.status(400).json({ message: 'Invalid product list' });
  }

  try {
    // (Optional) Save the order to DB here
    // await OrderModel.create({ userId, products });

    // Send email via Resend
    await sendOrderConfirmationEmail(userId, products);

    res.status(200).json({ message: 'Order placed and confirmation email sent!' });
  } catch (error) {
    console.error('Order error:', error);
    res.status(500).json({ message: 'Failed to place order or send email' });
  }
};
