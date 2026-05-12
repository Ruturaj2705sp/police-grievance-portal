/**
 * Admin / Police Routes
 */

const express = require('express');
const router = express.Router();
const {
  getAllComplaints,
  updateComplaintStatus,
  deleteComplaint,
  getAllUsers,
  toggleUserStatus,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All admin routes require authentication and police/admin role
router.use(protect);
router.use(authorize('police', 'admin'));

// Complaint management
router.get('/complaints', getAllComplaints);
router.put('/complaints/:id/status', updateComplaintStatus);
router.delete('/complaints/:id', authorize('admin'), deleteComplaint);

// User management (admin only)
router.get('/users', authorize('admin'), getAllUsers);
router.put('/users/:id/toggle', authorize('admin'), toggleUserStatus);

module.exports = router;
