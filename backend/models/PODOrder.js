const mongoose = require('mongoose');

const podOrderSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
      unique: true,
    },
    podProvider: {
      type: String,
      default: 'QIKINK',
    },
    podOrderId: {
      type: String,
      required: true,
    },
    idempotencyKey: {
      type: String,
      required: true,
      unique: true,
    },
    podStatus: {
      type: String,
      default: 'SUBMITTED',
    },
    trackingNumber: {
      type: String,
      default: '',
    },
    courier: {
      type: String,
      default: '',
    },
    itemsSent: [
      {
        sku: String,
        podVariantId: String,
        quantity: Number,
      },
    ],
    providerResponse: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('PODOrder', podOrderSchema);
