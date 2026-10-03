const Order = require('../models/Order');
const Payment = require('../models/Payment');
const WebhookEvent = require('../models/WebhookEvent');
const paymentService = require('../services/payment/paymentService');
const emailService = require('../services/email/emailService');
const { autoSubmitOrderToPOD } = require('./podController');

// @desc    Verify Razorpay Payment Signature
// @route   POST /api/payments/verify
// @access  Public
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId } = req.body;

    if (!razorpayOrderId || !razorpayPaymentId || !orderId) {
      return res.status(400).json({ success: false, message: 'Missing payment verification parameters' });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Verify HMAC-SHA256 signature
    const isValid = paymentService.verifyPaymentSignature({
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    });

    if (!isValid) {
      order.paymentStatus = 'FAILED';
      await order.save();
      return res.status(400).json({ success: false, message: 'Invalid payment signature. Verification failed.' });
    }

    // Record Payment
    await Payment.create({
      order: order._id,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      amount: order.total,
      currency: 'INR',
      status: 'PAID',
      signatureVerified: true,
    });

    // Update Order Status Server-Side
    order.paymentStatus = 'PAID';
    order.orderStatus = 'PAID';
    order.razorpayPaymentId = razorpayPaymentId;
    order.razorpaySignature = razorpaySignature;
    await order.save();

    // Send confirmation email and trigger auto POD submission asynchronously
    emailService.sendOrderConfirmation(order);
    autoSubmitOrderToPOD(order);

    res.json({
      success: true,
      message: 'Payment verified and order updated to PAID successfully.',
      orderNumber: order.orderNumber,
      trackingToken: order.trackingToken,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Razorpay Webhook Endpoint (Idempotent Payment Sync)
// @route   POST /api/payments/webhook
// @access  Public
exports.handleWebhook = async (req, res) => {
  try {
    const webhookSignature = req.headers['x-razorpay-signature'];
    const eventId = req.webhookEventId;

    // Optional webhook signature check if secret is configured
    if (process.env.RAZORPAY_WEBHOOK_SECRET) {
      const isValid = paymentService.verifyWebhookSignature(req.rawBody || JSON.stringify(req.body), webhookSignature);
      if (!isValid) {
        console.warn('[Razorpay Webhook]: Invalid webhook signature received');
        return res.status(400).json({ success: false, message: 'Invalid webhook signature' });
      }
    }

    const event = req.body.event;
    const payload = req.body.payload;

    console.log(`[Razorpay Webhook Event Received]: ${event}`);

    if (event === 'payment.captured' || event === 'order.paid') {
      const entity = payload.payment?.entity || payload.order?.entity;
      const razorpayOrderId = entity.order_id || entity.id;
      const razorpayPaymentId = entity.id;

      const order = await Order.findOne({ razorpayOrderId });
      if (order && order.paymentStatus !== 'PAID') {
        order.paymentStatus = 'PAID';
        order.orderStatus = 'PAID';
        order.razorpayPaymentId = razorpayPaymentId;
        await order.save();

        console.log(`[Webhook]: Order ${order.orderNumber} successfully marked PAID via webhook.`);
        emailService.sendOrderConfirmation(order);
        autoSubmitOrderToPOD(order);
      }
    } else if (event === 'payment.failed') {
      const entity = payload.payment.entity;
      const order = await Order.findOne({ razorpayOrderId: entity.order_id });
      if (order && order.paymentStatus === 'PENDING') {
        order.paymentStatus = 'FAILED';
        await order.save();
      }
    }

    // Mark WebhookEvent as PROCESSED
    if (eventId) {
      await WebhookEvent.findOneAndUpdate({ eventId }, { processingStatus: 'PROCESSED', processedAt: new Date() });
    }

    res.json({ status: 'ok' });
  } catch (error) {
    console.error('[Webhook Processing Error]:', error.message);
    if (req.webhookEventId) {
      await WebhookEvent.findOneAndUpdate(
        { eventId: req.webhookEventId },
        { processingStatus: 'FAILED', errorMessage: error.message }
      );
    }
    res.status(500).json({ success: false, message: error.message });
  }
};
