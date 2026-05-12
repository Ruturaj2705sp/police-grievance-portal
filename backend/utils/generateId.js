/**
 * Complaint ID Generator
 * Generates unique, human-readable complaint IDs
 * Format: GRV-YYYY-XXXXXX (e.g., GRV-2024-001234)
 */

const Complaint = require('../models/Complaint');

/**
 * Generates a unique complaint ID
 * @returns {Promise<string>} Unique complaint ID
 */
const generateComplaintId = async () => {
  const year = new Date().getFullYear();
  const prefix = `GRV-${year}-`;

  // Get count of complaints this year to generate sequential number
  const count = await Complaint.countDocuments({
    complaintId: { $regex: `^${prefix}` },
  });

  // Format: GRV-2024-001234 (6 digit zero-padded number)
  const sequentialNumber = String(count + 1).padStart(6, '0');
  return `${prefix}${sequentialNumber}`;
};

module.exports = { generateComplaintId };
