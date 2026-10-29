const Order = require('../models/Order');
const PODOrder = require('../models/PODOrder');
const AdminAuditLog = require('../models/AdminAuditLog');
const getPODService = require('../services/pod/index');

const resolvePODService = () => {
  return typeof getPODService === 'function' ? getPODService() : getPODService;
};

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
    if (existingPOD || order.podOrderId) {
      return res.status(400).json({
        success: false,
        message: `Order #${order.orderNumber} has already been submitted to POD provider. (POD ID: ${existingPOD ? existingPOD.podOrderId : order.podOrderId})`,
      });
    }

    const podService = resolvePODService();
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
    if (!order || !order._id) return null;

    // Atomic lock: Only proceed if order has not been submitted and is not currently submitting
    const orderToSubmit = await Order.findOneAndUpdate(
      {
        _id: order._id,
        podOrderId: { $in: ['', null] },
        podStatus: { $nin: ['SUBMITTED', 'SUBMITTING', 'PROCESSING', 'SHIPPED', 'DELIVERED'] },
      },
      { $set: { podStatus: 'SUBMITTING' } },
      { new: true }
    );

    if (!orderToSubmit) {
      console.log(`[Auto POD]: Order #${order.orderNumber} is already submitted or in-flight. Skipping duplicate call.`);
      return await PODOrder.findOne({ order: order._id });
    }

    const existingPOD = await PODOrder.findOne({ order: order._id });
    if (existingPOD) return existingPOD;

    const podService = resolvePODService();
    const result = await podService.submitFulfillmentOrder(orderToSubmit);

    const podOrder = await PODOrder.create({
      order: orderToSubmit._id,
      podProvider: result.podProvider || 'QIKINK',
      podOrderId: result.podOrderId,
      idempotencyKey: `pod_key_${orderToSubmit.orderNumber}`,
      podStatus: result.status || 'SUBMITTED',
      trackingNumber: result.trackingNumber || '',
      courier: result.courier || '',
      providerResponse: result.rawResponse || {},
    });

    orderToSubmit.orderStatus = 'FULFILLMENT_PENDING';
    orderToSubmit.podOrderId = result.podOrderId;
    orderToSubmit.podStatus = result.status || 'SUBMITTED';
    if (result.trackingNumber) orderToSubmit.trackingNumber = result.trackingNumber;
    if (result.courier) orderToSubmit.courier = result.courier;
    await orderToSubmit.save();

    console.log(`[Auto POD Submission Success]: Order #${orderToSubmit.orderNumber} pushed to ${result.podProvider} (POD ID: ${result.podOrderId})`);
    return podOrder;
  } catch (error) {
    if (order && order._id) {
      await Order.findByIdAndUpdate(order._id, { $set: { podStatus: 'SUBMISSION_FAILED' } });
    }
    console.error(`[Auto POD Submission Error]: Order #${order.orderNumber} - ${error.message}`);
  }
};

// @desc    Test connection to POD Provider (Qikink Sandbox / Live / Mock)
// @route   POST /api/pod/test-connection
// @access  Private/Admin
exports.testPODConnection = async (req, res) => {
  try {
    const podService = resolvePODService();
    const mode = (process.env.POD_MODE || 'mock').toLowerCase();

    if (mode === 'mock') {
      return res.json({
        success: true,
        mode: 'mock',
        message: 'Currently using Mock POD Service (Local Sandbox). Change POD_MODE=sandbox or POD_MODE=live in .env to test Qikink API.',
      });
    }

    if (typeof podService.testConnection === 'function') {
      const result = await podService.testConnection();
      return res.json({
        success: true,
        mode,
        ...result,
      });
    }

    res.json({
      success: true,
      mode,
      message: `POD Service active for mode '${mode}'`,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      mode: process.env.POD_MODE,
      message: error.message,
    });
  }
};

const verifyPODWebhookSecret = (req) => {
  const secret = process.env.POD_WEBHOOK_SECRET;
  if (!secret) {
    // If webhook secret is not explicitly set in environment, allow callback to update tracking
    return true;
  }
  const provided = req.headers['x-pod-webhook-secret'] || req.headers['x-qikink-signature'] || req.query.secret;
  return provided === secret;
};

// @desc    Qikink Tracking / Docket Status Webhook Listener
// @route   POST /api/pod/webhook/status
// @access  Public (Secret Protected)
exports.handleQikinkWebhook = async (req, res) => {
  try {
    if (!verifyPODWebhookSecret(req)) {
      return res.status(401).json({ success: false, message: 'Unauthorized: Invalid or missing webhook secret' });
    }

    const body = req.body || {};
    const orderNum = body.order_number || body.order_reference || body.client_order_id || body.reference_id;
    const qikinkOrderId = String(body.order_id || body.qikink_order_id || body.id || '');
    const status = body.status || body.shipment_status || body.order_status;
    const trackingNumber = body.tracking_number || body.awb_number || body.awb || body.docket_number || body.docket_no || body.tracking_id || body.waybill_number;
    const courierName = body.courier_name || body.courier || body.courier_partner || body.carrier || 'Qikink-Domestic';

    console.log('[Qikink Webhook Received]:', body);

    const query = [];
    if (orderNum) {
      query.push({ orderNumber: String(orderNum).trim() });
      const stripped = String(orderNum).replace(/[^a-zA-Z0-9]/g, '');
      if (stripped.length >= 8) {
        query.push({ orderNumber: new RegExp(stripped.split('').join('-?'), 'i') });
      }
    }
    if (qikinkOrderId) query.push({ podOrderId: qikinkOrderId });

    if (query.length === 0) {
      return res.status(400).json({ success: false, message: 'No valid order number or pod order id provided' });
    }

    const order = await Order.findOne({ $or: query });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Matching order not found' });
    }

    if (trackingNumber) order.trackingNumber = String(trackingNumber).trim();
    if (courierName) order.courier = String(courierName).trim();
    if (status) {
      order.podStatus = status;
      const upperStatus = String(status).toUpperCase();
      if (['SHIPPED', 'DISPATCHED', 'DELIVERED', 'IN_TRANSIT', 'CANCELLED', 'RTO'].includes(upperStatus)) {
        order.orderStatus = upperStatus === 'IN_TRANSIT' ? 'SHIPPED' : upperStatus;
        if (upperStatus === 'DELIVERED' && !order.deliveredAt) {
          order.deliveredAt = new Date();
        }
      }
    }

    await order.save();

    await PODOrder.findOneAndUpdate(
      { order: order._id },
      {
        podStatus: status || order.podStatus,
        trackingNumber: order.trackingNumber,
        courier: order.courier,
      }
    );

    res.json({
      success: true,
      message: 'Order tracking and AWB docket updated successfully from Qikink',
      orderNumber: order.orderNumber,
      trackingNumber: order.trackingNumber,
      courier: order.courier,
    });
  } catch (error) {
    console.error('[Qikink Webhook Error]:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Qikink "Push to Store" Product Import/Sync Endpoint
// @route   POST /api/pod/webhook/product-sync
// @access  Public / Secret Protected
exports.syncQikinkProduct = async (req, res) => {
  try {
    if (!verifyPODWebhookSecret(req)) {
      return res.status(401).json({ success: false, message: 'Unauthorized: Invalid or missing webhook secret' });
    }

    const Product = require('../models/Product');
    const Category = require('../models/Category');
    const { product_name, description, selling_price, product_id, skus, variants, images } = req.body;

    if (!product_name) {
      return res.status(400).json({ success: false, message: 'Product name is required' });
    }

    let defaultCategory = await Category.findOne({ isActive: true });

    const slug = String(product_name + '-' + (product_id || Date.now()))
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    let product = await Product.findOne({
      $or: [{ podProductId: String(product_id) }, { slug }],
    });

    const formattedVariants = (variants || skus || []).map((v) => ({
      sku: v.sku || v.variant_id || `SKU-${v.size || 'M'}`,
      color: v.color || 'Black',
      size: v.size || 'M',
      price: Number(v.selling_price || selling_price || 499),
      podVariantId: String(v.variant_id || v.sku || ''),
      isActive: true,
    }));

    if (product) {
      product.name = product_name;
      product.price = Number(selling_price || product.price);
      product.podProductId = String(product_id || product.podProductId);
      if (formattedVariants.length) product.variants = formattedVariants;
      await product.save();

      return res.json({ success: true, message: 'Product synced/updated from Qikink', product });
    }

    product = await Product.create({
      name: product_name,
      slug,
      description: description || 'High quality print-on-demand streetwear product.',
      price: Number(selling_price || 499),
      category: defaultCategory ? defaultCategory._id : undefined,
      podProductId: String(product_id || ''),
      images: (images || [{ url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800' }]).map((img) => ({
        url: typeof img === 'string' ? img : img.url || img.src,
      })),
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      variants: formattedVariants,
      status: 'ACTIVE',
    });

    res.json({ success: true, message: 'Product created from Qikink Push To Store', product });
  } catch (error) {
    console.error('[Product Sync Error]:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

