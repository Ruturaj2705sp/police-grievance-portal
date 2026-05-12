/**
 * Complaint Model
 * Core model for managing citizen complaints
 */

const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema(
  {
    // Auto-generated unique complaint ID (e.g., GRV-2024-001234)
    complaintId: {
      type: String,
      unique: true,
      required: true,
    },

    // Complainant information
    complainant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Complainant is required'],
    },

    // Complaint details
    title: {
      type: String,
      required: [true, 'Complaint title is required'],
      trim: true,
      minlength: [10, 'Title must be at least 10 characters'],
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Complaint description is required'],
      trim: true,
      minlength: [20, 'Description must be at least 20 characters'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },

    // Complaint category
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'murder',
        'kidnapping',
        'assault',
        'terrorism',
        'robbery',
        'harassment',
        'fraud',
        'cybercrime',
        'theft',
        'vandalism',
        'noise_complaint',
        'traffic_issue',
        'minor_dispute',
        'domestic_violence',
        'missing_person',
        'other',
      ],
    },

    // AI-determined priority level
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Low',
    },

    // Current status of the complaint
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Resolved', 'Rejected'],
      default: 'Pending',
    },

    // Incident location details
    incidentLocation: {
      type: String,
      required: [true, 'Incident location is required'],
      trim: true,
    },
    incidentDate: {
      type: Date,
      required: [true, 'Incident date is required'],
    },

    // Uploaded evidence files
    evidence: [
      {
        filename: String,
        originalName: String,
        mimetype: String,
        size: Number,
        path: String,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // Police/Admin notes and updates
    remarks: {
      type: String,
      trim: true,
      maxlength: [500, 'Remarks cannot exceed 500 characters'],
    },

    // Officer assigned to handle the complaint
    assignedOfficer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },

    // Status update history
    statusHistory: [
      {
        status: {
          type: String,
          enum: ['Pending', 'In Progress', 'Resolved', 'Rejected'],
        },
        updatedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        updatedAt: {
          type: Date,
          default: Date.now,
        },
        note: String,
      },
    ],

    // Whether complaint is flagged as high priority alert
    isAlertFlagged: {
      type: Boolean,
      default: false,
    },

    // Soft delete flag
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// ─── Index for faster queries ─────────────────────────────────────────────────
complaintSchema.index({ complaintId: 1 });
complaintSchema.index({ complainant: 1 });
complaintSchema.index({ priority: 1 });
complaintSchema.index({ status: 1 });
complaintSchema.index({ category: 1 });
complaintSchema.index({ createdAt: -1 });

// ─── Virtual: Short description preview ───────────────────────────────────────
complaintSchema.virtual('descriptionPreview').get(function () {
  return this.description.length > 100
    ? this.description.substring(0, 100) + '...'
    : this.description;
});

module.exports = mongoose.model('Complaint', complaintSchema);
