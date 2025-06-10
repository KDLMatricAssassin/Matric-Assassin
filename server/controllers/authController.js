const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Player = require('../models/Player');
const Game = require('../models/Game');
const { sendVerificationEmail } = require('../utils/email');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password, verificationCode } = req.body;

  try {
    // Check if user exists
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    user = new User({
      email,
      password,
      verificationCode
    });

    // Check if this is an admin registration (using a verification code from the admin list)
    const adminEmails = process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.split(',') : [];
    if (adminEmails.includes(email)) {
      user.role = 'admin';
      user.isVerified = true; // Auto-verify admin accounts
    } else if (verificationCode) {
      // For players joining with a verification code
      const player = await Player.findOne({ verificationCode });
      
      if (!player) {
        return res.status(400).json({ message: 'Invalid verification code' });
      }
      
      if (player.email !== email) {
        return res.status(400).json({ message: 'Email does not match the one registered for this code' });
      }
      
      user.verificationCode = verificationCode;
      user.isVerified = true; // Auto-verify users with valid verification codes
      
      // Link user to player
      player.user = user._id;
      await player.save();
    } else {
      return res.status(400).json({ message: 'Verification code is required' });
    }

    await user.save();

    // Send verification email if not already verified
    if (!user.isVerified) {
      const verificationCode = user.generateVerificationCode();
      await user.save();
      
      await sendVerificationEmail(user.email, verificationCode);
      
      return res.status(201).json({
        message: 'User registered. Please check your email to verify your account.',
        userId: user._id
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      _id: user._id,
      email: user.email,
      role: user.role,
      token
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check for user email
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      // Check if account is verified
      if (!user.isVerified) {
        return res.status(401).json({ 
          message: 'Please verify your email before logging in',
          needsVerification: true
        });
      }

      res.json({
        _id: user._id,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Verify user email
// @route   POST /api/auth/verify-email
// @access  Public
const verifyEmail = async (req, res) => {
  const { verificationCode } = req.body;

  try {
    const user = await User.findOne({ verificationCode });

    if (!user) {
      return res.status(400).json({ message: 'Invalid verification code' });
    }

    user.isVerified = true;
    user.verificationCode = undefined;
    await user.save();

    // If this is a player, link their user account
    if (verificationCode) {
      await Player.findOneAndUpdate(
        { verificationCode },
        { user: user._id },
        { new: true }
      );
    }

    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    // Get player profile if exists
    const player = await Player.findOne({ user: user._id })
      .populate('game', 'name status')
      .populate('target', 'name status')
      .populate('hunter', 'name');
    
    res.json({
      ...user._doc,
      player
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Request password reset
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate reset token
    const resetToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET + user.password,
      { expiresIn: '1h' }
    );

    // Save token to user
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 3600000; // 1 hour
    await user.save();

    // Send email with reset link
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    await sendPasswordResetEmail(user.email, resetUrl);

    res.json({ message: 'Password reset email sent' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Reset password
// @route   PUT /api/auth/reset-password/:token
// @access  Public
const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    // Find user by token
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET + user.password);
    
    // Update password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    console.error(error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(400).json({ message: 'Invalid token' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

module.exports = {
  registerUser,
  loginUser,
  verifyEmail,
  getMe,
  forgotPassword,
  resetPassword,
};
