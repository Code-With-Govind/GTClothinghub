const Order = require('../models/Order');
const PODOrder = require('../models/PODOrder');
const AdminAuditLog = require('../models/AdminAuditLog');
const getPODService = require('../services/pod/index');

// @desc    Submit Order to POD Provider
// @route   POST /api/pod/orders/:orderId/submit
// @access  Private/Admin
exports.submitPODOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);

    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    // Validate order payment status before submission
    if (order.paymentStatus !== 'PAID' && order.paymentMethod !== 'COD') {
      return res.status(400).json({
        success: false,
        message: 'POD fulfillment requires verified PAID status or approved COD order.',
      });
    }

    // Prevent duplicate submission
    const existingPOD = await PODOrder.findOne({ order: order._id });
    if (existingPOD) {
      return res.status(400).json({
        success: false,
        message: `Order #${order.orderNumber} has already been submitted to POD provider. (POD ID: ${existingPOD.podOrderId})`,
      });
    }

    const podService = getPODService();
    const result = await podService.submitFulfillmentOrder(order);

    // Record POD Order
    const podOrder = await PODOrder.create({
      order: order._id,
      podProvider: result.podProvider || 'MOCK_POD',
      podOrderId: result.podOrderId,
      idempotencyKey: `pod_key_${order.orderNumber}`,
      podStatus: result.status || 'SUBMITTED',
      trackingNumber: result.trackingNumber || '',
      courier: result.courier || '',
      providerResponse: result.rawResponse || {},
    });

    // Update order status
    order.orderStatus = 'FULFILLMENT_PENDING';
    order.podOrderId = result.podOrderId;
    order.podStatus = result.status;
    if (result.trackingNumber) order.trackingNumber = result.trackingNumber;
    if (result.courier) order.courier = result.courier;
    await order.save();

    await AdminAuditLog.create({
      admin: req.user._id,
      adminEmail: req.user.email,
      action: 'POD_ORDER_SUBMITTED',
      entity: 'PODOrder',
      entityId: podOrder._id.toString(),
      metadata: { orderNumber: order.orderNumber, podOrderId: result.podOrderId },
    });

    res.json({
      success: true,
      message: `Order successfully pushed to POD Provider (${result.podProvider})`,
      podOrder,
      order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get POD Order status & list all POD orders
// @route   GET /api/pod/orders
// @access  Private/Admin
exports.getPODOrders = async (req, res) => {
  try {
    const podOrders = await PODOrder.find().populate('order').sort({ createdAt: -1 });
    res.json({ success: true, count: podOrders.length, podOrders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Helper function for automatic POD submission on payment completion / COD order
exports.autoSubmitOrderToPOD = async (order) => {
  try {
    const existingPOD = await PODOrder.findOne({ order: order._id });
    if (existingPOD) return existingPOD;

    const podService = getPODService();
    const result = await podService.submitFulfillmentOrder(order);

    const podOrder = await PODOrder.create({
      order: order._id,
      podProvider: result.podProvider || 'MOCK_POD',
      podOrderId: result.podOrderId,
      idempotencyKey: `pod_key_${order.orderNumber}`,
      podStatus: result.status || 'SUBMITTED',
      trackingNumber: result.trackingNumber || '',
      courier: result.courier || '',
      providerResponse: result.rawResponse || {},
    });

    order.orderStatus = 'FULFILLMENT_PENDING';
    order.podOrderId = result.podOrderId;
    order.podStatus = result.status;
    if (result.trackingNumber) order.trackingNumber = result.trackingNumber;
    if (result.courier) order.courier = result.courier;
    await order.save();

    console.log(`[Auto POD Submission Success]: Order #${order.orderNumber} pushed to ${result.podProvider}`);
    return podOrder;
  } catch (error) {
    console.error(`[Auto POD Submission Error]: Order #${order.orderNumber} - ${error.message}`);
  }
};

