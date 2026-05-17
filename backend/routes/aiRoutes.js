/**
 * AI Routes
 * All AI-powered endpoints — chatbot, analysis, translation
 */

const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { analyzeComplaint, getChatbotReply } = require('../utils/aiService');
const Complaint = require('../models/Complaint');

// ── Rate limiting for AI endpoints (prevent abuse) ────────────────────────
const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20,             // 20 requests per minute per IP
  message: { success: false, message: 'Too many requests. Please wait a moment.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: { success: false, message: 'Too many chat messages. Please slow down.' },
});

// ── POST /api/ai/analyze ───────────────────────────────────────────────────
// Analyze complaint text with Gemini AI
// Body: { title, description, complaintId? }
router.post('/analyze', aiLimiter, async (req, res) => {
  try {
    const { title, description, complaintId } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'title and description are required.',
      });
    }

    const analysis = await analyzeComplaint(title, description);

    // If complaintId provided, save analysis to MongoDB
    if (complaintId && analysis.aiProcessed) {
      await Complaint.findByIdAndUpdate(complaintId, {
        aiAnalysis: {
          ...analysis,
          processedAt: new Date(),
        },
      }).catch(err => console.error('Failed to save AI analysis:', err.message));
    }

    res.json({ success: true, analysis });
  } catch (error) {
    console.error('AI analyze route error:', error.message);
    res.status(500).json({
      success: false,
      message: 'AI analysis failed. Using default classification.',
      analysis: {
        category: 'other',
        priority: 'Low',
        priorityReason: 'Could not analyze — default priority assigned.',
        summary: req.body.description?.substring(0, 120) || '',
        riskLevel: 'Low',
        aiProcessed: false,
      },
    });
  }
});

// ── POST /api/ai/chat ──────────────────────────────────────────────────────
// Chatbot endpoint
// Body: { message, history: [{ role, content }] }
router.post('/chat', chatLimiter, async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Message is required.',
      });
    }

    // Sanitize message length
    const sanitizedMessage = message.trim().substring(0, 500);

    const result = await getChatbotReply(sanitizedMessage, history);

    res.json({
      success: true,
      reply: result.reply,
      aiProcessed: result.aiProcessed,
    });
  } catch (error) {
    console.error('Chatbot route error:', error.message);
    res.json({
      success: true,
      reply: "I'm here to help! Please describe your issue or ask about filing a complaint.",
      aiProcessed: false,
    });
  }
});

// ── GET /api/ai/analysis/:complaintId ─────────────────────────────────────
// Get saved AI analysis for a complaint
router.get('/analysis/:complaintId', async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.complaintId)
      .select('aiAnalysis complaintId title');

    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found.' });
    }

    res.json({ success: true, aiAnalysis: complaint.aiAnalysis || null });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch AI analysis.' });
  }
});

module.exports = router;
const express = require('express');
