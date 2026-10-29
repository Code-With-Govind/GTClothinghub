const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const crypto = require('crypto');
const emailService = require('../services/email/emailService');

const validateStrongPassword = (password) => {
  // Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
  const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return strongRegex.test(password);
};

const validateIndianPhone = (phone) => {
  if (!phone) return true;
  const cleanPhone = phone.replace(/[\s\-\+\(\)]/g, '').slice(-10);
  return /^[6-9]\d{9}$/.test(cleanPhone);
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password' });
    }

    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email.toLowerCase())) {
      return res.status(400).json({ success: false, message: 'Please enter a valid email address' });
    }

    if (phone && !validateIndianPhone(phone)) {
      return res.status(400).json({ success: false, message: 'Please enter a valid 10-digit Indian mobile phone number (starting with 6, 7, 8, or 9)' });
    }

    if (!validateStrongPassword(password)) {
      return res.status(400).json({
        success: false,
        message: 'Password is too weak! Must be at least 8 characters long and include an uppercase letter, lowercase letter, number, and special character (e.g. @, #, $, !)',
      });
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'Email address already registered' });
    }

    const cleanPhone = phone ? phone.replace(/[\s\-\+\(\)]/g, '').slice(-10) : '';

    const rawVerificationToken = crypto.randomBytes(32).toString('hex');
    const hashedVerificationToken = crypto.createHash('sha256').update(rawVerificationToken).digest('hex');

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      phone: cleanPhone,
      role: 'CUSTOMER',
      emailVerificationToken: hashedVerificationToken,
      emailVerificationExpire: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
      lastVerificationEmailSentAt: new Date(),
    });

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const verificationUrl = `${frontendUrl}/verify-email/${rawVerificationToken}`;

    emailService.sendEmailVerification(user.email, verificationUrl, user.name).catch((err) => {
      console.warn('[Registration Verification Dispatch Note]:', err.message);
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isEmailVerified: false,
        isPhoneVerified: user.isPhoneVerified,
      },
      message: 'Account created successfully! A verification link has been sent to your email.',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please enter email and password' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isEmailVerified: Boolean(user.isEmailVerified),
        isPhoneVerified: Boolean(user.isPhoneVerified),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isEmailVerified: Boolean(user.isEmailVerified),
        isPhoneVerified: Boolean(user.isPhoneVerified),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.name = req.body.name || user.name;
      user.phone = req.body.phone || user.phone;
      const updatedUser = await user.save();
      res.json({
        success: true,
        user: {
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          phone: updatedUser.phone,
          role: updatedUser.role,
        },
      });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Change Password
// @route   PUT /api/auth/change-password
// @access  Private
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');

    if (!user || !(await user.matchPassword(currentPassword))) {
      return res.status(400).json({ success: false, message: 'Current password incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Forgot Password (Generic response, single-use token, cooldown)
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res) => {
  try {
    const email = (req.body.email || '').trim().toLowerCase();
    if (!email) {
      return res.status(400).json({ success: false, message: 'Please enter your registered email address' });
    }

    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Please enter a valid email address' });
    }

    // Generic response regardless of whether email exists to prevent user enumeration
    const genericMessage = 'If an account exists with this email address, password reset instructions have been sent.';

    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: true, message: genericMessage });
    }

    // Cooldown check (60 seconds)
    const COOLDOWN_MS = 60 * 1000;
    if (user.resetPasswordExpire && (user.resetPasswordExpire.getTime() - Date.now() > (60 * 60 * 1000 - COOLDOWN_MS))) {
      return res.json({ success: true, message: genericMessage });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 60 * 60 * 1000; // 1 hour

    await user.save({ validateBeforeSave: false });

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;

    await emailService.sendPasswordReset(user.email, resetUrl, user.name);

    res.json({ success: true, message: genericMessage });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Reset Password with Token
// @route   POST /api/auth/reset-password/:resetToken
// @access  Public
exports.resetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ success: false, message: 'Please provide a new password' });
    }

    if (!validateStrongPassword(password)) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long and include an uppercase letter, lowercase letter, number, and special character (e.g. @, #, $, !)',
      });
    }

    const resetPasswordToken = crypto.createHash('sha256').update(req.params.resetToken).digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired password reset link. Please request a new one.',
      });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    user.passwordChangedAt = new Date();
    await user.save();

    res.json({
      success: true,
      message: 'Password reset successful! You can now log in with your new password.',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Verify email address using secure token link
// @route   GET /api/auth/verify-email/:token
// @route   POST /api/auth/verify-email/:token
// @access  Public
exports.verifyEmailToken = async (req, res) => {
  try {
    const rawToken = req.params.token;
    if (!rawToken) {
      return res.status(400).json({ success: false, message: 'Verification token is required' });
    }

    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

    const user = await User.findOne({
      emailVerificationToken: hashedToken,
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'This verification link is invalid or has already been used.',
      });
    }

    if (user.emailVerificationExpire && user.emailVerificationExpire < Date.now()) {
      return res.status(400).json({
        success: false,
        expired: true,
        message: 'This verification link has expired. Please request a new verification link.',
      });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpire = undefined;
    user.emailOtp = undefined;
    user.emailOtpExpire = undefined;
    await user.save({ validateBeforeSave: false });

    res.json({
      success: true,
      message: 'Your email address has been verified successfully!',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isEmailVerified: true,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Resend Email Verification Link
// @route   POST /api/auth/resend-verification
// @access  Public
exports.resendVerification = async (req, res) => {
  try {
    const email = (req.body.email || req.user?.email || '').trim().toLowerCase();
    if (!email) {
      return res.status(400).json({ success: false, message: 'Please provide an email address' });
    }

    const genericMsg = 'If an unverified account exists for this email address, a new verification link has been sent.';

    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: true, message: genericMsg });
    }

    if (user.isEmailVerified) {
      return res.json({
        success: true,
        message: 'This email address is already verified.',
        alreadyVerified: true,
      });
    }

    // 60-second cooldown
    const COOLDOWN_MS = 60 * 1000;
    if (user.lastVerificationEmailSentAt && (Date.now() - user.lastVerificationEmailSentAt.getTime() < COOLDOWN_MS)) {
      const remainingSec = Math.ceil((COOLDOWN_MS - (Date.now() - user.lastVerificationEmailSentAt.getTime())) / 1000);
      return res.status(429).json({
        success: false,
        message: `Please wait ${remainingSec} seconds before requesting another verification email.`,
        retryAfter: remainingSec,
      });
    }

    const rawToken = crypto.randomBytes(32).toString('hex');
    user.emailVerificationToken = crypto.createHash('sha256').update(rawToken).digest('hex');
    user.emailVerificationExpire = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    user.lastVerificationEmailSentAt = new Date();
    await user.save({ validateBeforeSave: false });

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const verificationUrl = `${frontendUrl}/verify-email/${rawToken}`;

    await emailService.sendEmailVerification(user.email, verificationUrl, user.name);

    res.json({ success: true, message: genericMsg });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Send Email Verification OTP
// @route   POST /api/auth/send-email-otp
// @access  Public / Private
exports.sendEmailOtp = async (req, res) => {
  try {
    const email = req.body.email || req.user?.email;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Please provide email address' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ success: false, message: 'No user registered with this email' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.emailOtp = otp;
    user.emailOtpExpire = Date.now() + 10 * 60 * 1000; // 10 mins
    await user.save();

    await emailService.sendVerificationOtp(user.email, otp);

    res.json({
      success: true,
      message: `Verification code sent to ${user.email}`,
      demoOtp: (process.env.NODE_ENV !== 'production' && process.env.ALLOW_DEMO_OTP === 'true') ? otp : undefined,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Verify Email OTP
// @route   POST /api/auth/verify-email-otp
// @access  Public / Private
exports.verifyEmailOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const userEmail = email || req.user?.email;

    if (!userEmail || !otp) {
      return res.status(400).json({ success: false, message: 'Email and 6-digit OTP are required' });
    }

    const user = await User.findOne({ email: userEmail.toLowerCase() });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (!user.emailOtp || user.emailOtp !== otp.trim()) {
      return res.status(400).json({ success: false, message: 'Invalid OTP code' });
    }

    if (user.emailOtpExpire < Date.now()) {
      return res.status(400).json({ success: false, message: 'OTP code has expired. Please request a new code.' });
    }

    user.isEmailVerified = true;
    user.emailOtp = undefined;
    user.emailOtpExpire = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'Email address verified successfully!',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isEmailVerified: true,
        isPhoneVerified: user.isPhoneVerified,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Send Phone Verification OTP
// @route   POST /api/auth/send-phone-otp
// @access  Public / Private
exports.sendPhoneOtp = async (req, res) => {
  try {
    const { phone } = req.body;
    const userPhone = phone || req.user?.phone;

    if (!userPhone) {
      return res.status(400).json({ success: false, message: 'Mobile phone number is required' });
    }

    let user = req.user ? await User.findById(req.user._id) : await User.findOne({ phone: userPhone });

    if (!user && req.body.email) {
      user = await User.findOne({ email: req.body.email.toLowerCase() });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    if (user) {
      user.phone = userPhone;
      user.phoneOtp = otp;
      user.phoneOtpExpire = Date.now() + 10 * 60 * 1000;
      await user.save();
    }

    if (process.env.NODE_ENV !== 'production' && process.env.ALLOW_DEMO_OTP === 'true') {
      console.log(`\n--- [PHONE OTP SMS SIMULATION] ---`);
      console.log(`Phone: ${userPhone}`);
      console.log(`OTP Code: ${otp}`);
      console.log(`---------------------------------\n`);
    }

    res.json({
      success: true,
      message: `OTP sent to mobile number ${userPhone}`,
      demoOtp: (process.env.NODE_ENV !== 'production' && process.env.ALLOW_DEMO_OTP === 'true') ? otp : undefined,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Verify Phone OTP
// @route   POST /api/auth/verify-phone-otp
// @access  Public / Private
exports.verifyPhoneOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    const userPhone = phone || req.user?.phone;

    if (!userPhone || !otp) {
      return res.status(400).json({ success: false, message: 'Phone number and OTP code are required' });
    }

    const user = req.user ? await User.findById(req.user._id) : await User.findOne({ phone: userPhone });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User with this phone number not found' });
    }

    if (!user.phoneOtp || user.phoneOtp !== otp.trim()) {
      return res.status(400).json({ success: false, message: 'Invalid mobile OTP code' });
    }

    if (user.phoneOtpExpire < Date.now()) {
      return res.status(400).json({ success: false, message: 'Mobile OTP has expired. Please resend.' });
    }

    user.isPhoneVerified = true;
    user.phoneOtp = undefined;
    user.phoneOtpExpire = undefined;
    await user.save();

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Mobile phone number verified successfully!',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isEmailVerified: user.isEmailVerified,
        isPhoneVerified: true,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

