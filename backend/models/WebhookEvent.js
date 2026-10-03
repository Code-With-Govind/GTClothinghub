const mongoose = require('mongoose');

const webhookEventSchema = new mongoose.Schema(
  {
    provider: {
      type: String,
      required: true,
      default: 'RAZORPAY',
    },
    eventId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    eventType: {
      type: String,
      required: true,
    },
    receivedAt: {
      type: Date,
      default: Date.now,
    },
    processedAt: {
      type: Date,
      default: null,
    },
    processingStatus: {
      type: String,
      enum: ['RECEIVED', 'PROCESSED', 'FAILED', 'DUPLICATE'],
      default: 'RECEIVED',
    },
    errorMessage: {
      type: String,
      default: '',
    },
    payload: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('WebhookEvent', webhookEventSchema);
