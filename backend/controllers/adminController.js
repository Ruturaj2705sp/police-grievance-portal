/**
 * Admin Controller
 * Handles all police/admin operations for complaint management
 */

const Complaint = require('../models/Complaint');
const User = require('../models/User');

// ─── @route   GET /api/admin/complaints ──────────────────────────────────────
// ─── @desc    Get all complaints with filters ─────────────────────────────────
// ─── @access  Private (police, admin) ────────────────────────────────────────
const getAllComplaints = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      priority,
      category,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query;

    // Build dynamic filter
    const filter = { isDeleted: false };
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (category) filter.category = category;

    // Search across multiple fields
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { complaintId: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { incidentLocation: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    const [complaints, total] = await Promise.all([
      Complaint.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .populate('complainant', 'name email phone')
        .populate('assignedOfficer', 'name badgeNumber stationName'),
      Complaint.countDocuments(filter),
    ]);

    // Count high priority unresolved for alert badge
    const highPriorityCount = await Complaint.countDocuments({
      priority: 'High',
      status: { $in: ['Pending', 'In Progress'] },
      isDeleted: false,
    });

    res.json({
      success: true,
      complaints,
      highPriorityAlertCount: highPriorityCount,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Get All Complaints Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch complaints.' });
  }
};

// ─── @route   PUT /api/admin/complaints/:id/status ───────────────────────────
// ─── @desc    Update complaint status ────────────────────────────────────────
// ─── @access  Private (police, admin) ────────────────────────────────────────
const updateComplaintStatus = async (req, res) => {
  try {
    const { status, remarks, assignedOfficerId } = req.body;

    const validStatuses = ['Pending', 'In Progress', 'Resolved', 'Rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value.' });
    }

    const complaint = await Complaint.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found.' });
    }

    // Update status
    complaint.status = status;
    if (remarks) complaint.remarks = remarks;
    if (assignedOfficerId) complaint.assignedOfficer = assignedOfficerId;

    // Add to status history log
    complaint.statusHistory.push({
      status,
      updatedBy: req.user._id,
      note: remarks || `Status updated to ${status}`,
    });

    await complaint.save();
    await complaint.populate('complainant', 'name email');
    await complaint.populate('assignedOfficer', 'name badgeNumber');

    res.json({
      success: true,
      message: `Complaint status updated to "${status}"`,
      complaint,
    });
  } catch (error) {
    console.error('Update Status Error:', error);
    res.status(500).json({ success: false, message: 'Failed to update complaint status.' });
  }
};

// ─── @route   DELETE /api/admin/complaints/:id ───────────────────────────────
// ─── @desc    Soft delete a complaint (mark as deleted) ──────────────────────
// ─── @access  Private (admin) ────────────────────────────────────────────────
const deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      { new: true }
    );

    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found.' });
    }

    res.json({
      success: true,
      message: 'Complaint has been removed from the system.',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete complaint.' });
  }
};

// ─── @route   GET /api/admin/users ───────────────────────────────────────────
// ─── @desc    Get all users (admin only) ─────────────────────────────────────
// ─── @access  Private (admin) ────────────────────────────────────────────────
const getAllUsers = async (req, res) => {
  try {
    const { role, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (role) filter.role = role;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [users, total] = await Promise.all([
      User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
      User.countDocuments(filter),
    ]);

    res.json({
      success: true,
      users,
      pagination: { total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch users.' });
  }
};

// ─── @route   PUT /api/admin/users/:id/toggle ────────────────────────────────
// ─── @desc    Toggle user active/inactive status ─────────────────────────────
// ─── @access  Private (admin) ────────────────────────────────────────────────
const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      success: true,
      message: `User account ${user.isActive ? 'activated' : 'deactivated'} successfully.`,
      user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update user status.' });
  }
};

module.exports = {
  getAllComplaints,
  updateComplaintStatus,
  deleteComplaint,
  getAllUsers,
  toggleUserStatus,
};
