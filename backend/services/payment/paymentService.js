const crypto = require('crypto');
const getRazorpayInstance = require('../../config/razorpay');

class PaymentService {
  /**
   * Create Razorpay Order
   * @param {Object} params
   * @param {number} params.amountInRupees - Order total in INR
   * @param {string} params.receiptId - Internal Order Number
   * @returns {Promise<Object>} Razorpay Order details
   */
  async createPaymentOrder({ amountInRupees, receiptId }) {
    const razorpay = getRazorpayInstance();
    const mode = process.env.RAZORPAY_MODE || 'test';

    // If Razorpay instance is null (or keys not provided), return Mock Order
    if (!razorpay) {
      console.log(`[PaymentService (${mode})]: Generating Mock Razorpay Order for ${receiptId}`);
      return {
        id: `order_mock_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        entity: 'order',
        amount: Math.round(amountInRupees * 100),
        amount_paid: 0,
        amount_due: Math.round(amountInRupees * 100),
        currency: 'INR',
        receipt: receiptId,
        status: 'created',
        isMock: true,
      };
    }

    const options = {
      amount: Math.round(amountInRupees * 100), // Amount in paise
      currency: 'INR',
      receipt: receiptId,
      notes: {
        orderNumber: receiptId,
        environment: mode,
      },
    };

    const razorpayOrder = await razorpay.orders.create(options);
    return razorpayOrder;
  }

  /**
   * Verify Razorpay Payment Signature (HMAC-SHA256)
   * @param {Object} params
   * @param {string} params.razorpayOrderId
   * @param {string} params.razorpayPaymentId
   * @param {string} params.razorpaySignature
   * @returns {boolean} isValid
   */
  verifyPaymentSignature({ razorpayOrderId, razorpayPaymentId, razorpaySignature }) {
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // Handle mock mode
    if (razorpayOrderId.startsWith('order_mock_')) {
      return true;
    }

    if (!keySecret) {
      console.warn('[PaymentService]: Cannot verify signature - RAZORPAY_KEY_SECRET missing');
      return false;
    }

    const generatedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    return generatedSignature === razorpaySignature;
  }

  /**
   * Verify Razorpay Webhook Signature
   * @param {string|Buffer} rawBody
   * @param {string} webhookSignature
   * @returns {boolean} isValid
   */
  verifyWebhookSignature(rawBody, webhookSignature) {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!webhookSecret) return false;

    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(rawBody)
      .digest('hex');

    return expectedSignature === webhookSignature;
  }

  /**
   * Process Refund
   * @param {string} paymentId
   * @param {number} amountInRupees
   */
  async processRefund(paymentId, amountInRupees) {
    const razorpay = getRazorpayInstance();
    if (!razorpay || paymentId.startsWith('pay_mock_')) {
      return {
        id: `ref_mock_${Date.now()}`,
        payment_id: paymentId,
        amount: Math.round(amountInRupees * 100),
        status: 'processed',
        isMock: true,
      };
    }

    const refund = await razorpay.payments.refund(paymentId, {
      amount: Math.round(amountInRupees * 100),
      speed: 'normal',
    });
    return refund;
  }
}

module.exports = new PaymentService();
