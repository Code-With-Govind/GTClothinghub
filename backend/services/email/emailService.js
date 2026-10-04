const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = null;
    this.initTransporter();
  }

  initTransporter() {
    if (process.env.EMAIL_MODE === 'production' && process.env.SMTP_HOST) {
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_PORT === '465',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    }
  }

  /**
   * Non-blocking safe email sender
   */
  async sendEmail({ to, subject, html, text }) {
    const from = `"${process.env.FROM_NAME || 'GT Clothing Hub Studio'}" <${process.env.FROM_EMAIL || 'noreply@gtclothinghub.com'}>`;

    if (!this.transporter) {
      console.log('\n--- [EMAIL DEVELOPMENT SIMULATION] ---');
      console.log(`To: ${to}`);
      console.log(`Subject: ${subject}`);
      console.log(`Body (Text): ${text || html?.substring(0, 150)}...`);
      console.log('-------------------------------------\n');
      return { success: true, simulated: true };
    }

    try {
      const info = await this.transporter.sendMail({
        from,
        to,
        subject,
        text,
        html,
      });
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('[Email Dispatch Error]:', error.message);
      // Non-blocking return
      return { success: false, error: error.message };
    }
  }

  async sendOrderConfirmation(order) {
    const email = order.shippingAddress.email;
    const subject = `Order Confirmed - #${order.orderNumber}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0;">
        <h2 style="color: #111;">Thank you for your order!</h2>
        <p>Order Number: <strong>${order.orderNumber}</strong></p>
        <p>Total Amount: <strong>₹${order.total}</strong></p>
        <p>Payment Method: <strong>${order.paymentMethod}</strong></p>
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;" />
        <h3>Shipping Address</h3>
        <p>${order.shippingAddress.fullName}<br/>${order.shippingAddress.street}<br/>${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}</p>
        <p>We are printing and preparing your streetwear items on demand!</p>
      </div>
    `;
    return this.sendEmail({ to: email, subject, html });
  }

  async sendShippingNotification(order) {
    const email = order.shippingAddress.email;
    const subject = `Your Order #${order.orderNumber} Has Shipped!`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0;">
        <h2 style="color: #111;">Your order is on its way!</h2>
        <p>Order Number: <strong>${order.orderNumber}</strong></p>
        <p>Courier: <strong>${order.courier || 'Express Shipping'}</strong></p>
        <p>Tracking Number: <strong>${order.trackingNumber || 'Available shortly'}</strong></p>
      </div>
    `;
    return this.sendEmail({ to: email, subject, html });
  }

  async sendPasswordReset(email, resetUrl) {
    const subject = `Password Reset Request`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2>Password Reset</h2>
        <p>You requested a password reset. Click the button below to set a new password:</p>
        <a href="${resetUrl}" style="background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 15px 0;">Reset Password</a>
        <p>This link is valid for 1 hour.</p>
      </div>
    `;
    return this.sendEmail({ to: email, subject, html });
  }

  async sendVerificationOtp(email, otp) {
    const subject = `Your GT Clothing Hub Verification Code: ${otp}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; background-color: #FAF8F3;">
        <h2 style="color: #292621; font-size: 22px;">Verify Your Email Address</h2>
        <p style="color: #6F6A61; font-size: 14px;">Use the 6-digit code below to complete your email verification on GT CLOTHING HUB:</p>
        <div style="background-color: #292621; color: #ffffff; font-size: 28px; font-weight: bold; letter-spacing: 6px; padding: 16px; text-align: center; border-radius: 8px; margin: 20px 0;">
          ${otp}
        </div>
        <p style="color: #6F6A61; font-size: 12px;">This OTP is valid for 10 minutes. Do not share this code with anyone.</p>
      </div>
    `;
    return this.sendEmail({ to: email, subject, html });
  }
}

module.exports = new EmailService();

