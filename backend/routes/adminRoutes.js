const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getAllOrders,
  updateOrderStatus,
  updateReturnRequest,
  processRefund,
  getAuditLogs,
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.use(protect, admin);

router.get('/dashboard', getDashboardStats);
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);
router.put('/orders/:id/return-request', updateReturnRequest);
router.post('/orders/:id/refund', processRefund);
router.get('/audit-logs', getAuditLogs);

module.exports = router;
