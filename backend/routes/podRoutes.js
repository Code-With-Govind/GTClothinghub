const express = require('express');
const router = express.Router();
const { submitPODOrder, getPODOrders } = require('../controllers/podController');
const { protect, admin } = require('../middleware/authMiddleware');

router.use(protect, admin);

router.post('/orders/:orderId/submit', submitPODOrder);
router.get('/orders', getPODOrders);

module.exports = router;
