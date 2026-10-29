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
  verifyEmailToken,
  resendVerification,
  sendEmailOtp,
  verifyEmailOtp,
  sendPhoneOtp,
  verifyPhoneOtp,
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

// Email Verification Link Routes (cryptographically secure single-use token)
router.get('/verify-email/:token', verifyEmailToken);
router.post('/verify-email/:token', strictLimiter, verifyEmailToken);
router.post('/resend-verification', strictLimiter, resendVerification);

// OTP Verification Routes
router.post('/send-email-otp', sendEmailOtp);
router.post('/verify-email-otp', verifyEmailOtp);
router.post('/send-phone-otp', sendPhoneOtp);
router.post('/verify-phone-otp', verifyPhoneOtp);

module.exports = router;

