const mongoose = require('mongoose');
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

    const cleanPhone = String(shippingAddress.phone || '').replace(/\D/g, '').slice(-10);
    if (!cleanPhone || cleanPhone.length !== 10 || !/^[6-9]\d{9}$/.test(cleanPhone)) {
      return res.status(400).json({ success: false, message: 'Invalid phone number. Must be a valid 10-digit Indian mobile number.' });
    }

    const cleanPin = String(shippingAddress.pincode || '').replace(/\D/g, '');
    if (!cleanPin || cleanPin.length !== 6 || !/^[1-9][0-9]{5}$/.test(cleanPin)) {
      return res.status(400).json({ success: false, message: 'Invalid Pincode. Must be a valid 6-digit Indian PIN code.' });
    }

    if (String(shippingAddress.street || '').trim().length < 10) {
      return res.status(400).json({ success: false, message: 'Street address is too short. Please provide house/flat number, building, and street name (min 10 characters).' });
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
      if (!item.quantity || !Number.isInteger(item.quantity) || item.quantity <= 0) {
        return res.status(400).json({ success: false, message: 'Invalid item quantity. Must be a positive integer.' });
      }

      const product = await Product.findById(item.product || item.productId);
      if (!product || product.status !== 'ACTIVE') {
        return res.status(400).json({ success: false, message: `Product ${item.name || 'item'} is unavailable.` });
      }

      const itemColor = (item.color || '').toLowerCase();
      const itemSize = (item.size || '').toUpperCase();

      const variant = (product.variants || []).find(
        (v) => (v.color || '').toLowerCase() === itemColor && (v.size || '').toUpperCase() === itemSize
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

    const total = settings.isTaxInclusive
      ? Math.round((netSubtotal + shipCalc.totalShippingCost) * 100) / 100
      : Math.round((netSubtotal + taxCalc.taxTotal + shipCalc.totalShippingCost) * 100) / 100;
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
      razorpayKey: process.env.RAZORPAY_KEY_ID,
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
    const isObjectId = mongoose.Types.ObjectId.isValid(req.params.id);
    const order = isObjectId
      ? await Order.findById(req.params.id).populate('user', 'name email')
      : await Order.findOne({ orderNumber: req.params.id }).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Security check: User must own order or be admin
    const orderUserId = order.user?._id ? order.user._id.toString() : (order.user ? order.user.toString() : null);
    const requestUserId = req.user?._id ? req.user._id.toString() : null;

    if (req.user.role !== 'ADMIN' && (!orderUserId || orderUserId !== requestUserId)) {
      return res.status(403).json({ success: false, message: 'Access denied: You do not have permission to view this order.' });
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
        message: 'Both Order Number and Tracking Token are required to look up order details.',
      });
    }

    const order = await Order.findOne({ orderNumber, trackingToken });

    if (!order) {
      return res.status(404).json({ success: false, message: `Order #${orderNumber} not found.` });
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
// @access  Private (Owner / Admin)
exports.requestReturn = async (req, res) => {
  try {
    const isObjectId = mongoose.Types.ObjectId.isValid(req.params.id);
    const existingOrder = isObjectId
      ? await Order.findById(req.params.id)
      : await Order.findOne({ orderNumber: req.params.id });

    if (!existingOrder) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const orderUserId = existingOrder.user?._id ? existingOrder.user._id.toString() : (existingOrder.user ? existingOrder.user.toString() : null);
    const requestUserId = req.user?._id ? req.user._id.toString() : null;

    if (req.user.role !== 'ADMIN' && (!orderUserId || orderUserId !== requestUserId)) {
      return res.status(403).json({ success: false, message: 'Access denied: You do not have permission to modify this order.' });
    }

    if (existingOrder.orderStatus !== 'DELIVERED') {
      return res.status(400).json({ success: false, message: 'Return requests can only be placed for delivered orders.' });
    }

    if (existingOrder.returnRequest?.status && existingOrder.returnRequest.status !== 'NONE') {
      return res.status(409).json({
        success: false,
        message: `A return request has already been submitted for this order (Status: ${existingOrder.returnRequest.status}). Duplicate requests are not permitted.`,
      });
    }

    const { reason, details, items } = req.body;
    const validReasons = [
      'Defective Product / Manufacturing Defect',
      'Damaged Product / Damaged in Transit',
    ];

    const sanitizedReason = (reason || '').trim();
    if (!validReasons.includes(sanitizedReason)) {
      return res.status(400).json({
        success: false,
        message: 'Please select a valid return reason conforming to store policy: "Defective Product / Manufacturing Defect" or "Damaged Product / Damaged in Transit".',
      });
    }

    const sanitizedDetails = (details || '').trim().slice(0, 1000);

    // 7-day eligibility check or legacy manual review flagging
    let isLegacyReview = false;
    const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

    if (existingOrder.deliveredAt) {
      const elapsed = Date.now() - new Date(existingOrder.deliveredAt).getTime();
      if (elapsed > SEVEN_DAYS_MS) {
        return res.status(400).json({
          success: false,
          message: 'The 7-day return window from the delivery date has expired for this order as per store policy.',
        });
      }
    } else {
      isLegacyReview = true;
    }

    // Item selection and bounds validation against original order items
    let validatedItems = [];
    if (Array.isArray(items) && items.length > 0) {
      for (const it of items) {
        const originalItem = existingOrder.items.id(it.orderItemId) ||
          existingOrder.items.find((orig) => orig._id.toString() === it.orderItemId || orig.sku === it.sku);

        if (!originalItem) {
          return res.status(400).json({
            success: false,
            message: `Invalid order item specified: ${it.orderItemId || it.sku}`,
          });
        }

        const reqQty = Number(it.quantity) || 1;
        if (!Number.isInteger(reqQty) || reqQty < 1 || reqQty > originalItem.quantity) {
          return res.status(400).json({
            success: false,
            message: `Invalid return quantity for item "${originalItem.name}". Must be between 1 and ${originalItem.quantity}.`,
          });
        }

        validatedItems.push({
          orderItemId: originalItem._id.toString(),
          product: originalItem.product,
          name: originalItem.name,
          sku: originalItem.sku,
          color: originalItem.color,
          size: originalItem.size,
          image: originalItem.image,
          unitPrice: originalItem.price,
          quantity: reqQty,
          reason: (it.reason || sanitizedReason).trim().slice(0, 200),
        });
      }
    } else {
      validatedItems = existingOrder.items.map((orig) => ({
        orderItemId: orig._id.toString(),
        product: orig.product,
        name: orig.name,
        sku: orig.sku,
        color: orig.color,
        size: orig.size,
        image: orig.image,
        unitPrice: orig.price,
        quantity: orig.quantity,
        reason: sanitizedReason,
      }));
    }

    // Atomic concurrency lock via findOneAndUpdate
    const updatedOrder = await Order.findOneAndUpdate(
      {
        _id: existingOrder._id,
        orderStatus: 'DELIVERED',
        'returnRequest.status': { $in: ['NONE', null] },
      },
      {
        $set: {
          orderStatus: 'RETURN_REQUESTED',
          'returnRequest.status': 'PENDING',
          'returnRequest.reason': sanitizedReason,
          'returnRequest.details': sanitizedDetails,
          'returnRequest.items': validatedItems,
          'returnRequest.isLegacyReview': isLegacyReview,
          'returnRequest.requestedAt': new Date(),
        },
      },
      { new: true, runValidators: true }
    );

    if (!updatedOrder) {
      return res.status(409).json({
        success: false,
        message: 'A return request is already active or in progress for this order. Duplicate requests are rejected.',
      });
    }

    res.json({
      success: true,
      message: isLegacyReview
        ? 'Return request received and queued for manual delivery date verification by our studio team.'
        : 'Return request submitted successfully. Our team will review your request.',
      order: updatedOrder,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Generate Invoice JSON/HTML data
// @route   GET /api/orders/:id/invoice
// @access  Private
exports.getOrderInvoice = async (req, res) => {
  try {
    const isObjectId = mongoose.Types.ObjectId.isValid(req.params.id);
    const order = isObjectId
      ? await Order.findById(req.params.id)
      : await Order.findOne({ orderNumber: req.params.id });

    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    // Security check: User must own order or be admin
    const orderUserId = order.user?._id ? order.user._id.toString() : (order.user ? order.user.toString() : null);
    const requestUserId = req.user?._id ? req.user._id.toString() : null;

    if (req.user.role !== 'ADMIN' && (!orderUserId || orderUserId !== requestUserId)) {
      return res.status(403).json({ success: false, message: 'Access denied: You do not own this order' });
    }

    const settings = (await Settings.findOne()) || {};
    const invoice = invoiceService.generateInvoice(order, settings);

    res.json({ success: true, invoice });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
