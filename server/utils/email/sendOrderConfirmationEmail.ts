import { clerkClient } from '@clerk/clerk-sdk-node';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY!);

type OrderedProduct = {
  name: string;
  quantity: number;
  price: number;
};

export const sendOrderConfirmationEmail = async (
  userId: string,
  products: OrderedProduct[]
) => {
  const user = await clerkClient.users.getUser(userId);
  const name = user.firstName || 'Customer';
  const email = user.emailAddresses[0].emailAddress;

  const orderNumber = `ORD-${Date.now().toString().slice(-6)}`;
  const orderDate = new Date().toLocaleDateString();
  const deliveryDate = new Date(Date.now() + 7 * 86400000).toLocaleDateString();

  const html = generateOrderEmail(name, orderNumber, orderDate, deliveryDate, products);

  await resend.emails.send({
    from: 'Your Store <support@yourdomain.com>', // you can use Resend's demo domain first
    to: email,
    subject: `Your Order ${orderNumber} is Confirmed!`,
    html,
  });
};

const generateOrderEmail = (
  name: string,
  orderNumber: string,
  orderDate: string,
  deliveryDate: string,
  products: OrderedProduct[]
): string => {
  const productRows = products
    .map(
      (p) => `
      <tr>
        <td>${p.name}</td>
        <td style="text-align:center;">${p.quantity}</td>
        <td style="text-align:right;">₹${(p.price * p.quantity).toLocaleString('en-IN')}</td>
      </tr>`
    )
    .join('');

  const total = products.reduce((sum, p) => sum + p.price * p.quantity, 0);

  return `
  <!DOCTYPE html>
  <html>
    <body style="font-family: Arial, sans-serif;">
      <h2>Hi ${name},</h2>
      <p>Thank you for your order <strong>${orderNumber}</strong> placed on <strong>${orderDate}</strong>.</p>
      <p>Estimated Delivery: <strong>${deliveryDate}</strong></p>

      <h3>Order Summary:</h3>
      <table width="100%" cellpadding="10" cellspacing="0" style="border-collapse: collapse;">
        <thead>
          <tr style="border-bottom: 1px solid #ccc;">
            <th align="left">Product</th>
            <th align="center">Qty</th>
            <th align="right">Total</th>
          </tr>
        </thead>
        <tbody>
          ${productRows}
          <tr style="border-top: 1px solid #ccc; font-weight: bold;">
            <td colspan="2" align="right">Total:</td>
            <td align="right">₹${total.toLocaleString('en-IN')}</td>
          </tr>
        </tbody>
      </table>

      <p style="margin-top: 20px;">We’ll notify you when your items are on the way. Thank you for shopping with us!</p>

      <p style="color: #888; font-size: 12px;">© 2025 Your Store. This is an automated message, do not reply.</p>
    </body>
  </html>
  `;
};
