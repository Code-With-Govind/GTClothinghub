const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrderById,
  trackOrder,
  requestReturn,
  getOrderInvoice,
} = require('../controllers/orderController');
const { validateCart } = require('../controllers/cartController');
const { protect, optionalAuth } = require('../middleware/authMiddleware');
const { strictLimiter } = require('../middleware/rateLimiterMiddleware');

router.post('/validate-cart', validateCart);
router.post('/validate', validateCart);
router.post('/', optionalAuth, strictLimiter, createOrder);
router.get('/my-orders', protect, getMyOrders);
router.post('/track', trackOrder);
router.get('/:id', protect, getOrderById);
router.post('/:id/return', protect, requestReturn);
router.get('/:id/invoice', protect, getOrderInvoice);

module.exports = router;
