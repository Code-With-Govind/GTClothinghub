const express = require('express');
const router = express.Router();
const {
  submitPODOrder,
  getPODOrders,
  testPODConnection,
  handleQikinkWebhook,
  syncQikinkProduct,
} = require('../controllers/podController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public Webhook callbacks from Qikink
router.post('/webhook/status', handleQikinkWebhook);
router.post('/webhook/product-sync', syncQikinkProduct);

// Protected Admin POD routes
router.use(protect, admin);

router.post('/test-connection', testPODConnection);
router.post('/orders/:orderId/submit', submitPODOrder);
router.get('/orders', getPODOrders);

module.exports = router;
