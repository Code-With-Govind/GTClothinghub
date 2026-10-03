const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');
const Payment = require('../models/Payment');
const AdminAuditLog = require('../models/AdminAuditLog');
const paymentService = require('../services/payment/paymentService');
const emailService = require('../services/email/emailService');

// @desc    Get Admin Dashboard Stats & Sales Charts
// @route   GET /api/admin/dashboard
// @access  Private/Admin
exports.getDashboardStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ orderStatus: { $in: ['PENDING_PAYMENT', 'PROCESSING', 'FULFILLMENT_PENDING'] } });
    const paidOrders = await Order.countDocuments({ paymentStatus: 'PAID' });
    const shippedOrders = await Order.countDocuments({ orderStatus: 'SHIPPED' });
    const deliveredOrders = await Order.countDocuments({ orderStatus: 'DELIVERED' });
    const totalCustomers = await User.countDocuments({ role: 'CUSTOMER' });
    const totalProducts = await Product.countDocuments();

    // Total Revenue Calculation
    const revenueAggregate = await Order.aggregate([
      { $match: { paymentStatus: 'PAID' } },
      { $group: { _id: null, totalRevenue: { $sum: '$total' } } },
    ]);
    const totalSales = revenueAggregate[0]?.totalRevenue || 0;

    // Today's Sales
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const todayAggregate = await Order.aggregate([
      { $match: { paymentStatus: 'PAID', createdAt: { $gte: startOfToday } } },
      { $group: { _id: null, todayRevenue: { $sum: '$total' } } },
    ]);
    const todaySales = todayAggregate[0]?.todayRevenue || 0;

    // Sales over time (Last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const salesOverTime = await Order.aggregate([
      { $match: { paymentStatus: 'PAID', createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          sales: { $sum: '$total' },
          ordersCount: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Recent 5 Orders
    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5);

    res.json({
      success: true,
      stats: {
        totalSales,
        todaySales,
        totalOrders,
        pendingOrders,
        paidOrders,
        shippedOrders,
        deliveredOrders,
        totalCustomers,
        totalProducts,
      },
      salesOverTime,
      recentOrders,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all orders (Admin with filters)
// @route   GET /api/admin/orders
// @access  Private/Admin
exports.getAllOrders = async (req, res) => {
  try {
    const { status, paymentStatus, page = 1, limit = 20 } = req.query;
    const query = {};

    if (status) query.orderStatus = status;
    if (paymentStatus) query.paymentStatus = paymentStatus;

    const count = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ success: true, count, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update Order Status & Tracking (Admin)
// @route   PUT /api/admin/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus, paymentStatus, trackingNumber, courier, rtoReason } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    if (orderStatus) order.orderStatus = orderStatus;
    if (paymentStatus) order.paymentStatus = paymentStatus;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (courier) order.courier = courier;
    if (rtoReason) order.rtoReason = rtoReason;

    await order.save();

    // Audit Log
    await AdminAuditLog.create({
      admin: req.user._id,
      adminEmail: req.user.email,
      action: 'ORDER_STATUS_CHANGED',
      entity: 'Order',
      entityId: order._id.toString(),
      metadata: { orderNumber: order.orderNumber, orderStatus, paymentStatus, trackingNumber },
    });

    // Notify customer if shipped
    if (orderStatus === 'SHIPPED') {
      emailService.sendShippingNotification(order);
    }

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Process Refund (Admin)
// @route   POST /api/admin/orders/:id/refund
// @access  Private/Admin
exports.processRefund = async (req, res) => {
  try {
    const { refundAmount } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    const amountToRefund = refundAmount || order.total;

    // Process Razorpay refund if payment ID exists
    let refundResult = { isMock: true, id: `REF-${Date.now()}` };
    if (order.razorpayPaymentId) {
      refundResult = await paymentService.processRefund(order.razorpayPaymentId, amountToRefund);
    }

    order.paymentStatus = 'REFUNDED';
    order.orderStatus = 'REFUNDED';
    order.returnRequest = {
      ...order.returnRequest,
      status: 'APPROVED',
      refundAmount: amountToRefund,
      refundId: refundResult.id || refundResult.refundId || 'REFUNDED',
      processedAt: new Date(),
    };

    await order.save();

    await AdminAuditLog.create({
      admin: req.user._id,
      adminEmail: req.user.email,
      action: 'REFUND_PROCESSED',
      entity: 'Order',
      entityId: order._id.toString(),
      metadata: { orderNumber: order.orderNumber, refundAmount: amountToRefund, refundId: refundResult.id },
    });

    res.json({ success: true, message: 'Refund processed successfully', order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Audit Logs
// @route   GET /api/admin/audit-logs
// @access  Private/Admin
exports.getAuditLogs = async (req, res) => {
  try {
    const logs = await AdminAuditLog.find().sort({ createdAt: -1 }).limit(100);
    res.json({ success: true, count: logs.length, logs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
