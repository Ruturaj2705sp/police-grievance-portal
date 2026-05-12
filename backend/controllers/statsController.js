/**
 * Statistics Controller
 * Provides analytics data for admin dashboard charts
 */

const Complaint = require('../models/Complaint');
const User = require('../models/User');

// ─── @route   GET /api/stats/dashboard ───────────────────────────────────────
// ─── @desc    Get dashboard statistics for admin ──────────────────────────────
// ─── @access  Private (police, admin) ────────────────────────────────────────
const getDashboardStats = async (req, res) => {
  try {
    // Run all aggregation queries in parallel for performance
    const [
      totalComplaints,
      pendingComplaints,
      inProgressComplaints,
      resolvedComplaints,
      rejectedComplaints,
      highPriorityComplaints,
      mediumPriorityComplaints,
      lowPriorityComplaints,
      totalCitizens,
      categoryStats,
      monthlyTrend,
      recentHighPriority,
    ] = await Promise.all([
      // Total counts
      Complaint.countDocuments({ isDeleted: false }),
      Complaint.countDocuments({ status: 'Pending', isDeleted: false }),
      Complaint.countDocuments({ status: 'In Progress', isDeleted: false }),
      Complaint.countDocuments({ status: 'Resolved', isDeleted: false }),
      Complaint.countDocuments({ status: 'Rejected', isDeleted: false }),

      // Priority counts
      Complaint.countDocuments({ priority: 'High', isDeleted: false }),
      Complaint.countDocuments({ priority: 'Medium', isDeleted: false }),
      Complaint.countDocuments({ priority: 'Low', isDeleted: false }),

      // Users
      User.countDocuments({ role: 'citizen' }),

      // Complaints by category (for pie/bar chart)
      Complaint.aggregate([
        { $match: { isDeleted: false } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 8 },
      ]),

      // Monthly trend for last 6 months (for line chart)
      Complaint.aggregate([
        {
          $match: {
            isDeleted: false,
            createdAt: {
              $gte: new Date(new Date().setMonth(new Date().getMonth() - 6)),
            },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
            },
            total: { $sum: 1 },
            resolved: {
              $sum: { $cond: [{ $eq: ['$status', 'Resolved'] }, 1, 0] },
            },
            highPriority: {
              $sum: { $cond: [{ $eq: ['$priority', 'High'] }, 1, 0] },
            },
          },
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
      ]),

      // Recent high priority unresolved complaints
      Complaint.find({
        priority: 'High',
        status: { $in: ['Pending', 'In Progress'] },
        isDeleted: false,
      })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('complainant', 'name email'),
    ]);

    // Format monthly trend data for chart rendering
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const formattedMonthlyTrend = monthlyTrend.map(item => ({
      month: months[item._id.month - 1],
      year: item._id.year,
      total: item.total,
      resolved: item.resolved,
      highPriority: item.highPriority,
    }));

    res.json({
      success: true,
      stats: {
        // Summary cards
        totalComplaints,
        pendingComplaints,
        inProgressComplaints,
        resolvedComplaints,
        rejectedComplaints,
        highPriorityComplaints,
        mediumPriorityComplaints,
        lowPriorityComplaints,
        totalCitizens,

        // Resolution rate percentage
        resolutionRate:
          totalComplaints > 0
            ? ((resolvedComplaints / totalComplaints) * 100).toFixed(1)
            : 0,

        // Chart data
        categoryStats: categoryStats.map(c => ({
          category: c._id,
          count: c.count,
        })),
        monthlyTrend: formattedMonthlyTrend,

        // Priority distribution for donut chart
        priorityDistribution: [
          { name: 'High', value: highPriorityComplaints, color: '#ef4444' },
          { name: 'Medium', value: mediumPriorityComplaints, color: '#f59e0b' },
          { name: 'Low', value: lowPriorityComplaints, color: '#22c55e' },
        ],

        // Status distribution
        statusDistribution: [
          { name: 'Pending', value: pendingComplaints, color: '#f59e0b' },
          { name: 'In Progress', value: inProgressComplaints, color: '#3b82f6' },
          { name: 'Resolved', value: resolvedComplaints, color: '#22c55e' },
          { name: 'Rejected', value: rejectedComplaints, color: '#ef4444' },
        ],

        // Alert: recent high-priority complaints
        recentHighPriority,
      },
    });
  } catch (error) {
    console.error('Stats Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch statistics.' });
  }
};

// ─── @route   GET /api/stats/citizen ─────────────────────────────────────────
// ─── @desc    Get citizen's personal complaint statistics ─────────────────────
// ─── @access  Private (citizen) ──────────────────────────────────────────────
const getCitizenStats = async (req, res) => {
  try {
    const citizenId = req.user._id;

    const [total, pending, inProgress, resolved] = await Promise.all([
      Complaint.countDocuments({ complainant: citizenId, isDeleted: false }),
      Complaint.countDocuments({ complainant: citizenId, status: 'Pending', isDeleted: false }),
      Complaint.countDocuments({ complainant: citizenId, status: 'In Progress', isDeleted: false }),
      Complaint.countDocuments({ complainant: citizenId, status: 'Resolved', isDeleted: false }),
    ]);

    res.json({
      success: true,
      stats: { total, pending, inProgress, resolved },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch your statistics.' });
  }
};

module.exports = { getDashboardStats, getCitizenStats };
