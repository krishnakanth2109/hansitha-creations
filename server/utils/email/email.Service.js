const { clerkClient } = require('@clerk/clerk-sdk-node');
const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

exports.sendOrderConfirmationEmail = async (userId, products) => {
  const user = await clerkClient.users.getUser(userId);
  const email = user.emailAddresses[0].emailAddress;
  const name = user.firstName || 'Customer';

  const html = `
    <h2>Hi ${name},</h2>
    <p>Thank you for your order! Here are your order details:</p>
    <ul>
      ${products
        .map(
          (item) =>
            `<li><strong>${item.name}</strong> - ₹${item.price.toLocaleString('en-IN')} x ${item.quantity}</li>`
        )
        .join('')}
    </ul>
    <p>We hope you enjoy your purchase!</p>
    <p>– Your Store Team</p>
  `;

  await resend.emails.send({
    from: 'paladugusaiganesh@gmail.com',
    to: email,
    subject: 'Your Order Confirmation',
    html,
  });
};
