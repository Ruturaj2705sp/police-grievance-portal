/**
 * Authentication Controller
 * Handles user registration, login, and profile management
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Generate JWT token for a user
 * @param {string} id - User ID
 * @returns {string} JWT token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

// ─── @route   POST /api/auth/register ────────────────────────────────────────
// ─── @desc    Register a new citizen user ────────────────────────────────────
// ─── @access  Public ─────────────────────────────────────────────────────────
const register = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required.',
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists.',
      });
    }

    // Create new user (role defaults to 'citizen')
    const user = await User.create({
      name,
      email,
      password,
      phone,
      address,
      role: 'citizen',
    });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Register Error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: 'Registration failed. Please try again.' });
  }
};

// ─── @route   POST /api/auth/login ───────────────────────────────────────────
// ─── @desc    Login user (citizen, police, or admin) ─────────────────────────
// ─── @access  Public ─────────────────────────────────────────────────────────
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.',
      });
    }

    // Find user by email (include password for comparison)
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Contact admin.',
      });
    }

    // Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // Update last login timestamp
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login successful!',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        stationName: user.stationName,
        badgeNumber: user.badgeNumber,
        lastLogin: user.lastLogin,
      },
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ success: false, message: 'Login failed. Please try again.' });
  }
};

// ─── @route   GET /api/auth/me ────────────────────────────────────────────────
// ─── @desc    Get current logged-in user profile ─────────────────────────────
// ─── @access  Private ────────────────────────────────────────────────────────
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch profile.' });
  }
};

// ─── @route   PUT /api/auth/profile ──────────────────────────────────────────
// ─── @desc    Update user profile ────────────────────────────────────────────
// ─── @access  Private ────────────────────────────────────────────────────────
const updateProfile = async (req, res) => {
  try {
    const { name, phone, address } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone, address },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Profile updated successfully!',
      user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Profile update failed.' });
  }
};

// ─── @route   POST /api/auth/admin/register ───────────────────────────────────
// ─── @desc    Register police/admin user (admin only) ────────────────────────
// ─── @access  Private/Admin ──────────────────────────────────────────────────
const registerOfficer = async (req, res) => {
  try {
    const { name, email, password, phone, role, stationName, badgeNumber } = req.body;

    if (!['police', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role specified.' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered.' });
    }

    const officer = await User.create({
      name,
      email,
      password,
      phone,
      role,
      stationName,
      badgeNumber,
    });

    res.status(201).json({
      success: true,
      message: `${role === 'admin' ? 'Admin' : 'Officer'} account created successfully!`,
      user: officer.toPublicJSON(),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create officer account.' });
  }
};

module.exports = { register, login, getMe, updateProfile, registerOfficer };
