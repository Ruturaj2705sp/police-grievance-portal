/**
 * Authentication Routes
 */

const express = require('express');
const router = express.Router();
const { register, login, getMe, updateProfile, registerOfficer } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

// Admin-only route to create police officers
router.post('/register-officer', protect, authorize('admin'), registerOfficer);

module.exports = router;
