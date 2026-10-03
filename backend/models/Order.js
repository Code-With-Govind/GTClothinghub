const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  name: { type: String, required: true },
  image: { type: String, required: true },
  sku: { type: String, required: true },
  color: { type: String, required: true },
  size: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  variantId: { type: String, default: '' },
  podVariantId: { type: String, default: '' },
});

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    trackingToken: {
      type: String,
      required: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    guestEmail: {
      type: String,
      default: '',
    },
    items: [orderItemSchema],
    subtotal: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    couponCode: {
      type: String,
      default: '',
    },
    shipping: {
      type: Number,
      default: 0,
    },
    tax: {
      type: Number,
      default: 0,
    },
    taxBreakdown: {
      businessMode: { type: String, enum: ['PRE_REGISTRATION', 'GST_REGISTERED'], default: 'PRE_REGISTRATION' },
      cgst: { type: Number, default: 0 },
      sgst: { type: Number, default: 0 },
      igst: { type: Number, default: 0 },
      hsnCode: { type: String, default: '' },
    },
    total: {
      type: Number,
      required: true,
    },
    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String, required: true },
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
      country: { type: String, default: 'India' },
    },
    paymentMethod: {
      type: String,
      enum: ['RAZORPAY', 'COD'],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['PENDING', 'PAID', 'FAILED', 'REFUNDED', 'COD_PENDING'],
      default: 'PENDING',
    },
    orderStatus: {
      type: String,
      enum: [
        'PENDING_PAYMENT',
        'PAID',
        'PROCESSING',
        'FULFILLMENT_PENDING',
        'SHIPPED',
        'OUT_FOR_DELIVERY',
        'DELIVERED',
        'CANCELLED',
        'RETURN_REQUESTED',
        'RETURNED',
        'REFUND_PENDING',
        'REFUNDED',
        'RTO',
        'RTO_RECEIVED',
      ],
      default: 'PENDING_PAYMENT',
    },
    // Razorpay Details
    razorpayOrderId: { type: String, default: '' },
    razorpayPaymentId: { type: String, default: '' },
    razorpaySignature: { type: String, default: '' },
    
    // POD Details
    podOrderId: { type: String, default: '' },
    podStatus: { type: String, default: 'NOT_SUBMITTED' },
    
    // Shipping Details
    trackingNumber: { type: String, default: '' },
    courier: { type: String, default: '' },
    courierStatus: { type: String, default: '' },
    deliveryAttempts: { type: Number, default: 0 },
    rtoReason: { type: String, default: '' },
    
    // Cancellation / Refund Request
    returnRequest: {
      reason: { type: String, default: '' },
      details: { type: String, default: '' },
      requestedAt: { type: Date, default: null },
      status: { type: String, enum: ['NONE', 'PENDING', 'APPROVED', 'REJECTED'], default: 'NONE' },
      refundAmount: { type: Number, default: 0 },
      refundId: { type: String, default: '' },
      processedAt: { type: Date, default: null },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Order', orderSchema);
