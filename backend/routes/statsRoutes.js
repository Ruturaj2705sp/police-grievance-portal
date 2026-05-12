/**
 * Statistics Routes
 */

const express = require('express');
const router = express.Router();
const { getDashboardStats, getCitizenStats } = require('../controllers/statsController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Admin dashboard stats
router.get('/dashboard', protect, authorize('police', 'admin'), getDashboardStats);

// Citizen's personal stats
router.get('/citizen', protect, authorize('citizen'), getCitizenStats);

module.exports = router;
