/**
 * Complaint Controller
 * Handles all complaint-related operations for citizens
 */

const analyzeComplaint = require('../utils/geminiAI');
const Complaint = require('../models/Complaint');
const { generateComplaintId } = require('../utils/generateId');
const path = require('path');

// ─── @route   POST /api/complaints ───────────────────────────────────────────
// ─── @desc    Submit a new complaint ─────────────────────────────────────────
// ─── @access  Private (citizen) ──────────────────────────────────────────────
const submitComplaint = async (req, res) => {
  try {
    const { title, description, category, incidentLocation, incidentDate } = req.body;

    // Validate required fields
    if (!title || !description || !category || !incidentLocation || !incidentDate) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required.',
      });
    }

    // ─── AI Analysis ─────────────────────────────────────────────────────────
    const aiAnalysis = await analyzeComplaint(description);

    console.log("AI Analysis:", aiAnalysis);

    // ─── AI Priority Detection ──────────────────────────────────────────────
 let priority = "Low";

const priorityMatch = aiAnalysis.match(/Priority:\s*(HIGH|MEDIUM|LOW)/i);

if (priorityMatch) {
  priority =
    priorityMatch[1].charAt(0).toUpperCase() +
    priorityMatch[1].slice(1).toLowerCase();
}

console.log("Detected Priority:", priority);

    // ─── Generate Complaint ID ──────────────────────────────────────────────
    const complaintId = await generateComplaintId();

    // ─── Process Uploaded Evidence Files ────────────────────────────────────
    const evidence = [];

    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        evidence.push({
          filename: file.filename,
          originalName: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
          path: `/uploads/evidence/${file.filename}`,
        });
      });
    }

    // ─── Create Complaint ───────────────────────────────────────────────────
    const complaint = await Complaint.create({
      complaintId,
      complainant: req.user._id,
      title,
      description,
      category,
      priority,
      incidentLocation,
      incidentDate: new Date(incidentDate),
      evidence,
      isAlertFlagged: priority === 'High',
      statusHistory: [
        {
          status: 'Pending',
          updatedBy: req.user._id,
          note: 'Complaint submitted by citizen',
        },
      ],
    });

    // ─── Populate Complainant Details ───────────────────────────────────────
    await complaint.populate('complainant', 'name email phone');

    res.status(201).json({
      success: true,
      message: `Complaint submitted successfully! Your complaint ID is ${complaintId}`,
      complaint,
      aiAnalysis,
    });

  } catch (error) {
    console.error('Submit Complaint Error:', error);

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);

      return res.status(400).json({
        success: false,
        message: messages.join(', '),
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to submit complaint.',
    });
  }
};

// ─── @route   GET /api/complaints/my ─────────────────────────────────────────
// ─── @desc    Get all complaints of logged-in citizen ────────────────────────
// ─── @access  Private (citizen) ──────────────────────────────────────────────
const getMyComplaints = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, priority, search } = req.query;

    const filter = {
      complainant: req.user._id,
      isDeleted: false,
    };

    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { complaintId: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [complaints, total] = await Promise.all([
      Complaint.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .populate('complainant', 'name email')
        .populate('assignedOfficer', 'name badgeNumber stationName'),

      Complaint.countDocuments(filter),
    ]);

    res.json({
      success: true,
      complaints,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });

  } catch (error) {
    console.error('Get My Complaints Error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to fetch complaints.',
    });
  }
};

// ─── @route   GET /api/complaints/:id ────────────────────────────────────────
// ─── @desc    Get single complaint by ID ─────────────────────────────────────
// ─── @access  Private ────────────────────────────────────────────────────────
const getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findOne({
      $or: [
        { _id: req.params.id },
        { complaintId: req.params.id },
      ],
      isDeleted: false,
    })
      .populate('complainant', 'name email phone address')
      .populate('assignedOfficer', 'name email badgeNumber stationName')
      .populate('statusHistory.updatedBy', 'name role');

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found.',
      });
    }

    if (
      req.user.role === 'citizen' &&
      complaint.complainant._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Access denied.',
      });
    }

    res.json({
      success: true,
      complaint,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch complaint.',
    });
  }
};

// ─── @route   GET /api/complaints/track/:complaintId ─────────────────────────
// ─── @desc    Track complaint by complaint ID (public) ───────────────────────
// ─── @access  Public ─────────────────────────────────────────────────────────
const trackComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findOne({
      complaintId: req.params.complaintId.toUpperCase(),
      isDeleted: false,
    })
      .populate('complainant', 'name')
      .populate('assignedOfficer', 'name stationName')
      .select('-evidence.path');

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'No complaint found with this ID. Please check and try again.',
      });
    }

    res.json({
      success: true,
      complaint,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to track complaint.',
    });
  }
};

module.exports = {
  submitComplaint,
  getMyComplaints,
  getComplaintById,
  trackComplaint,
};
