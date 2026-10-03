const express = require('express');
const router = express.Router();
const { verifyPayment, handleWebhook } = require('../controllers/paymentController');
const checkWebhookIdempotency = require('../middleware/idempotencyMiddleware');
const { strictLimiter } = require('../middleware/rateLimiterMiddleware');

router.post('/verify', strictLimiter, verifyPayment);
router.post('/webhook', express.raw({ type: 'application/json' }), checkWebhookIdempotency, handleWebhook);

module.exports = router;
