const mongoose = require('mongoose');

const adminAuditLogSchema = new mongoose.Schema(
  {
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    adminEmail: {
      type: String,
      required: true,
    },
    action: {
      type: String,
      required: true, // e.g. "PRODUCT_CREATED", "SETTINGS_UPDATED", "ORDER_STATUS_CHANGED"
    },
    entity: {
      type: String,
      required: true, // e.g. "Product", "Order", "Settings"
    },
    entityId: {
      type: String,
      default: '',
    },
    metadata: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('AdminAuditLog', adminAuditLogSchema);
