const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const crypto = require('crypto');
const emailService = require('../services/email/emailService');

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password' });
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'Email address already registered' });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      phone: phone || '',
      role: 'CUSTOMER',
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
      },
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

// @desc    Forgot Password
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({ success: false, message: 'No account with that email address exists' });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 60 * 60 * 1000; // 1 hour

    await user.save();

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;

    await emailService.sendPasswordReset(user.email, resetUrl);

    res.json({ success: true, message: 'Password reset link sent to your email' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Reset Password
// @route   POST /api/auth/reset-password/:resetToken
// @access  Public
exports.resetPassword = async (req, res) => {
  try {
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.resetToken).digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired password reset token' });
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({ success: true, message: 'Password reset successful. You can now login with your new password.' });
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
      demoOtp: process.env.NODE_ENV === 'production' ? undefined : otp,
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

    console.log(`\n--- [PHONE OTP SMS SIMULATION] ---`);
    console.log(`Phone: ${userPhone}`);
    console.log(`OTP Code: ${otp}`);
    console.log(`---------------------------------\n`);

    res.json({
      success: true,
      message: `OTP sent to mobile number ${userPhone}`,
      demoOtp: otp,
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

