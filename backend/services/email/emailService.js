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

  async sendPasswordReset(email, resetUrl, name) {
    const subject = `Reset your GT Clothing Hub password`;
    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 24px; background-color: #FAF8F3; border: 1px solid #E5E2DC; border-radius: 12px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <span style="font-family: monospace; font-size: 11px; font-weight: bold; letter-spacing: 2px; color: #6F7358; text-transform: uppercase;">GT CLOTHING HUB • ACCOUNT SECURITY</span>
          <h1 style="color: #111111; font-size: 24px; font-weight: 800; text-transform: uppercase; margin: 12px 0 6px 0; letter-spacing: -0.5px;">Password Reset Request</h1>
          <p style="color: #666666; font-size: 14px; margin: 0;">Hi ${name || 'Customer'}, we received a request to reset your password.</p>
        </div>
        <div style="background-color: #FFFFFF; border: 1px solid #E5E2DC; border-radius: 8px; padding: 24px; text-align: center; margin: 24px 0;">
          <p style="color: #333333; font-size: 14px; line-height: 1.6; margin-top: 0;">Click the button below to set a new password. For security, this link is single-use and expires in 1 hour.</p>
          <a href="${resetUrl}" style="display: inline-block; background-color: #111111; color: #FFFFFF; font-size: 12px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; padding: 14px 28px; text-decoration: none; border-radius: 6px; margin: 12px 0;">RESET PASSWORD</a>
          <p style="color: #888888; font-size: 12px; margin-bottom: 0;">If the button does not work, copy and paste this link into your browser:<br/><a href="${resetUrl}" style="color: #6F7358; word-break: break-all;">${resetUrl}</a></p>
        </div>
        <p style="color: #999999; font-size: 11px; text-align: center; margin: 0;">If you did not request a password reset, you can safely ignore this email.</p>
      </div>
    `;
    const text = `Reset your GT Clothing Hub password: ${resetUrl} (Valid for 1 hour)`;
    return this.sendEmail({ to: email, subject, html, text });
  }

  async sendEmailVerification(email, verificationUrl, name) {
    const subject = `Verify your GT Clothing Hub account`;
    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 24px; background-color: #FAF8F3; border: 1px solid #E5E2DC; border-radius: 12px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <span style="font-family: monospace; font-size: 11px; font-weight: bold; letter-spacing: 2px; color: #6F7358; text-transform: uppercase;">GT CLOTHING HUB • AUTHENTIC STREETWEAR</span>
          <h1 style="color: #111111; font-size: 24px; font-weight: 800; text-transform: uppercase; margin: 12px 0 6px 0; letter-spacing: -0.5px;">Verify Your Email</h1>
          <p style="color: #666666; font-size: 14px; margin: 0;">Hi ${name || 'Customer'}, please verify your email address to secure your account.</p>
        </div>
        <div style="background-color: #FFFFFF; border: 1px solid #E5E2DC; border-radius: 8px; padding: 24px; text-align: center; margin: 24px 0;">
          <p style="color: #333333; font-size: 14px; line-height: 1.6; margin-top: 0;">Click the button below to complete email verification. This link is single-use and valid for 24 hours.</p>
          <a href="${verificationUrl}" style="display: inline-block; background-color: #111111; color: #FFFFFF; font-size: 12px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; padding: 14px 28px; text-decoration: none; border-radius: 6px; margin: 12px 0;">VERIFY EMAIL ADDRESS</a>
          <p style="color: #888888; font-size: 12px; margin-bottom: 0;">If the button does not work, copy and paste this link into your browser:<br/><a href="${verificationUrl}" style="color: #6F7358; word-break: break-all;">${verificationUrl}</a></p>
        </div>
        <p style="color: #999999; font-size: 11px; text-align: center; margin: 0;">If you did not register for an account, please disregard this email.</p>
      </div>
    `;
    const text = `Verify your GT Clothing Hub email address: ${verificationUrl} (Valid for 24 hours)`;
    return this.sendEmail({ to: email, subject, html, text });
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

