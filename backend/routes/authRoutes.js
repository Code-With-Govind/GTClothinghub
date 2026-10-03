const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { strictLimiter } = require('../middleware/rateLimiterMiddleware');

router.post('/register', strictLimiter, register);
router.post('/login', strictLimiter, login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);
router.post('/forgot-password', strictLimiter, forgotPassword);
router.post('/reset-password/:resetToken', strictLimiter, resetPassword);

module.exports = router;
