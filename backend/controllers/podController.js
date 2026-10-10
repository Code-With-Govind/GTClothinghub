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
    if (existingPOD) {
      return res.status(400).json({
        success: false,
        message: `Order #${order.orderNumber} has already been submitted to POD provider. (POD ID: ${existingPOD.podOrderId})`,
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
    const existingPOD = await PODOrder.findOne({ order: order._id });
    if (existingPOD) return existingPOD;

    const podService = resolvePODService();
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

// @desc    Qikink Tracking / Docket Status Webhook Listener
// @route   POST /api/pod/webhook/status
// @access  Public (Qikink Callback)
exports.handleQikinkWebhook = async (req, res) => {
  try {
    const { order_number, order_id, status, tracking_number, courier_name } = req.body;

    console.log('[Qikink Webhook Received]:', req.body);

    const order = await Order.findOne({
      $or: [{ orderNumber: order_number }, { podOrderId: order_id || req.body.id }],
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Matching order not found' });
    }

    if (tracking_number) order.trackingNumber = tracking_number;
    if (courier_name) order.courier = courier_name;
    if (status) {
      order.podStatus = status;
      if (['SHIPPED', 'DISPATCHED', 'DELIVERED'].includes(String(status).toUpperCase())) {
        order.orderStatus = status;
      }
    }

    await order.save();

    await PODOrder.findOneAndUpdate(
      { order: order._id },
      {
        podStatus: status || order.podStatus,
        trackingNumber: tracking_number || order.trackingNumber,
        courier: courier_name || order.courier,
      }
    );

    res.json({ success: true, message: 'Order tracking updated successfully from Qikink' });
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

