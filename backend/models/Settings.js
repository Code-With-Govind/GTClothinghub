const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema(
  {
    storeName: {
      type: String,
      default: 'GT Clothing Hub Studio',
    },
    brandName: {
      type: String,
      default: 'GT CLOTHING HUB',
    },
    proprietorName: {
      type: String,
      default: 'Business Owner',
    },
    supportEmail: {
      type: String,
      default: 'support@gtclothinghub.com',
    },
    supportPhone: {
      type: String,
      default: '+91 98765 43210',
    },
    address: {
      street: { type: String, default: '123 Fashion Street' },
      city: { type: String, default: 'Bengaluru' },
      state: { type: String, default: 'Karnataka' },
      pincode: { type: String, default: '560001' },
      country: { type: String, default: 'India' },
    },
    currency: {
      type: String,
      default: 'INR',
    },
    currencySymbol: {
      type: String,
      default: '₹',
    },

    // Business Compliance & Tax Settings
    businessMode: {
      type: String,
      enum: ['PRE_REGISTRATION', 'GST_REGISTERED'],
      default: 'PRE_REGISTRATION',
    },
    panNumber: {
      type: String,
      default: '',
    },
    gstin: {
      type: String,
      default: '',
    },
    gstRatePercentage: {
      type: Number,
      default: 5, // Default 5% apparel tax rate when GST registered
    },
    isTaxInclusive: {
      type: Boolean,
      default: true,
    },

    // Shipping & Payment Controls
    shippingFee: {
      type: Number,
      default: 79,
    },
    freeShippingThreshold: {
      type: Number,
      default: 999,
    },
    codEnabled: {
      type: Boolean,
      default: true,
    },
    codExtraFee: {
      type: Number,
      default: 49,
    },

    // Operational Modes
    podMode: {
      type: String,
      enum: ['mock', 'live'],
      default: 'mock',
    },
    paymentMode: {
      type: String,
      enum: ['test', 'live'],
      default: 'test',
    },

    // Policies & Content
    termsConditions: {
      type: String,
      default: 'Standard Terms and Conditions for GT Clothing Hub Studio.',
    },
    privacyPolicy: {
      type: String,
      default: 'Standard Privacy Policy for GT Clothing Hub Studio.',
    },
    shippingPolicy: {
      type: String,
      default: 'Orders are printed on demand and shipped within 3-5 business days.',
    },
    returnPolicy: {
      type: String,
      default: 'Returns accepted for defective or damaged products within 7 days of delivery.',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Settings', settingsSchema);
