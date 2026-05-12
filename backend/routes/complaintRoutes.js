/**
 * Complaint Routes
 */

const express = require('express');
const router = express.Router();
const {
  submitComplaint,
  getMyComplaints,
  getComplaintById,
  trackComplaint,
} = require('../controllers/complaintController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public route - track complaint by ID
router.get('/track/:complaintId', trackComplaint);

// Protected citizen routes
router.post(
  '/',
  protect,
  authorize('citizen'),
  upload.array('evidence', 5),
  submitComplaint
);
router.get('/my', protect, authorize('citizen'), getMyComplaints);
router.get('/:id', protect, getComplaintById);

module.exports = router;
