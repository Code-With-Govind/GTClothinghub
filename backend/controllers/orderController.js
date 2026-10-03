const Order = require('../models/Order');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');
const Settings = require('../models/Settings');
const taxService = require('../services/tax/taxService');
const shippingService = require('../services/shipping/index');
const invoiceService = require('../services/invoice/invoiceService');
const paymentService = require('../services/payment/paymentService');
const emailService = require('../services/email/emailService');
const { generateOrderNumber, generateTrackingToken } = require('../utils/generateOrderNumber');
const { autoSubmitOrderToPOD } = require('./podController');

// @desc    Create new order
// @route   POST /api/orders
// @access  Public / Private (supports guest & logged-in checkout)
exports.createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, couponCode } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No items in order' });
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.street || !shippingAddress.city || !shippingAddress.state || !shippingAddress.pincode) {
      return res.status(400).json({ success: false, message: 'Please provide complete shipping address details' });
    }

    const settings = (await Settings.findOne()) || {};

    // Validate COD availability
    if (paymentMethod === 'COD' && !settings.codEnabled) {
      return res.status(400).json({ success: false, message: 'Cash on Delivery is currently disabled' });
    }

    // Calculate totals server-side
    const validatedItems = [];
    let subtotal = 0;

    for (const item of items) {
      const product = await Product.findById(item.product || item.productId);
      if (!product || product.status !== 'ACTIVE') {
        return res.status(400).json({ success: false, message: `Product ${item.name} is unavailable.` });
      }

      const variant = product.variants.find(
        (v) => v.color.toLowerCase() === item.color.toLowerCase() && v.size.toUpperCase() === item.size.toUpperCase()
      );

      const price = variant ? variant.price : product.price;
      const sku = variant ? variant.sku : product.sku || `${product.slug}-${item.color}-${item.size}`;
      const podVariantId = variant ? variant.podVariantId : '';
      const image = product.images && product.images.length > 0 ? product.images[0].url : '';

      subtotal += price * item.quantity;

      validatedItems.push({
        product: product._id,
        name: product.name,
        image,
        sku,
        color: item.color,
        size: item.size,
        price,
        quantity: item.quantity,
        variantId: variant ? variant._id : '',
        podVariantId,
      });
    }

    // Process Coupon
    let discount = 0;
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true, expiryDate: { $gt: new Date() } });
      if (coupon && subtotal >= coupon.minOrderValue) {
        if (coupon.discountType === 'PERCENTAGE') {
          discount = (subtotal * coupon.discountValue) / 100;
          if (coupon.maxDiscountAmount > 0 && discount > coupon.maxDiscountAmount) discount = coupon.maxDiscountAmount;
        } else {
          discount = coupon.discountValue;
        }
        discount = Math.min(discount, subtotal);
        coupon.usedCount += 1;
        await coupon.save();
      }
    }

    const netSubtotal = subtotal - discount;

    // Calculate Tax & Shipping
    const taxCalc = taxService.calculateTax({ subtotal: netSubtotal, customerState: shippingAddress.state, settings });
    const shipCalc = await shippingService.calculateShippingFee({
      items: validatedItems,
      destinationState: shippingAddress.state,
      pincode: shippingAddress.pincode,
      subtotal: netSubtotal,
      paymentMethod,
      settings,
    });

    const total = Math.round((netSubtotal + taxCalc.taxTotal + shipCalc.totalShippingCost) * 100) / 100;
    const orderNumber = generateOrderNumber();
    const trackingToken = generateTrackingToken();

    let orderStatus = 'PENDING_PAYMENT';
    let paymentStatus = 'PENDING';

    if (paymentMethod === 'COD') {
      orderStatus = 'PROCESSING';
      paymentStatus = 'COD_PENDING';
    }

    const order = await Order.create({
      orderNumber,
      trackingToken,
      user: req.user ? req.user._id : null,
      guestEmail: shippingAddress.email,
      items: validatedItems,
      subtotal,
      discount,
      couponCode: couponCode ? couponCode.toUpperCase() : '',
      shipping: shipCalc.totalShippingCost,
      tax: taxCalc.taxTotal,
      taxBreakdown: taxCalc,
      total,
      shippingAddress,
      paymentMethod,
      paymentStatus,
      orderStatus,
    });

    let razorpayOrder = null;
    if (paymentMethod === 'RAZORPAY') {
      razorpayOrder = await paymentService.createPaymentOrder({
        amountInRupees: total,
        receiptId: orderNumber,
      });
      order.razorpayOrderId = razorpayOrder.id;
      await order.save();
    } else {
      // Send confirmation email asynchronously for COD
      emailService.sendOrderConfirmation(order);
      autoSubmitOrderToPOD(order);
    }

    res.status(201).json({
      success: true,
      order,
      razorpayOrder,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user's orders
// @route   GET /api/orders/my-orders
// @access  Private
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, count: orders.length, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single order details by ID
// @route   GET /api/orders/:id
// @access  Private (Owner / Admin)
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Security check: User must own order or be admin
    if (req.user.role !== 'ADMIN' && String(order.user) !== String(req.user._id)) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Track order securely (Guest / Public tracking via OrderNumber + TrackingToken)
// @route   POST /api/orders/track
// @access  Public
exports.trackOrder = async (req, res) => {
  try {
    const { orderNumber, trackingToken } = req.body;

    if (!orderNumber || !trackingToken) {
      return res.status(400).json({
        success: false,
        message: 'Order Number and Secure Tracking Token are required to look up order details.',
      });
    }

    const order = await Order.findOne({ orderNumber, trackingToken });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found with provided tracking credentials' });
    }

    // Public sanitized order response (excludes internal POD response & payment secrets)
    res.json({
      success: true,
      order: {
        orderNumber: order.orderNumber,
        createdAt: order.createdAt,
        orderStatus: order.orderStatus,
        paymentStatus: order.paymentStatus,
        paymentMethod: order.paymentMethod,
        items: order.items,
        total: order.total,
        shippingAddress: {
          fullName: order.shippingAddress.fullName,
          city: order.shippingAddress.city,
          state: order.shippingAddress.state,
          pincode: order.shippingAddress.pincode,
        },
        courier: order.courier,
        trackingNumber: order.trackingNumber,
        courierStatus: order.courierStatus,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Request return / refund
// @route   POST /api/orders/:id/return
// @access  Private
exports.requestReturn = async (req, res) => {
  try {
    const { reason, details } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (String(order.user) !== String(req.user._id)) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    if (order.orderStatus !== 'DELIVERED') {
      return res.status(400).json({ success: false, message: 'Return requests can only be placed for delivered orders.' });
    }

    order.orderStatus = 'RETURN_REQUESTED';
    order.returnRequest = {
      reason,
      details,
      requestedAt: new Date(),
      status: 'PENDING',
    };

    await order.save();
    res.json({ success: true, message: 'Return request submitted successfully', order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Generate Invoice JSON/HTML data
// @route   GET /api/orders/:id/invoice
// @access  Private
exports.getOrderInvoice = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    const settings = (await Settings.findOne()) || {};
    const invoice = invoiceService.generateInvoice(order, settings);

    res.json({ success: true, invoice });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
