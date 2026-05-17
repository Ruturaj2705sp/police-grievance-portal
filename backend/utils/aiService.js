/**
 * AI Service — Gemini API Integration
 * All AI features go through this single service.
 * Every function fails gracefully — never crashes the app.
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize only if API key exists
const genAI = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

/**
 * Safe JSON extractor — handles Gemini's markdown-wrapped JSON
 */
const extractJSON = (text) => {
  try {
    // Remove markdown code blocks if present
    const cleaned = text
      .replace(/```json\n?/gi, '')
      .replace(/```\n?/gi, '')
      .trim();
    return JSON.parse(cleaned);
  } catch {
    return null;
  }
};

/**
 * Analyze a complaint using Gemini AI
 * Returns: { category, priority, priorityReason, summary, riskLevel, aiProcessed }
 */
const analyzeComplaint = async (title, description, existingCategory = '') => {
  // Fallback if Gemini is unavailable
  const fallback = {
    category: existingCategory || 'other',
    priority: 'Low',
    priorityReason: 'Priority assigned by keyword detection system.',
    summary: description ? description.substring(0, 120) + '...' : title,
    riskLevel: 'Low',
    aiProcessed: false,
  };

  if (!genAI) return fallback;

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `You are a police complaint analysis AI for India.
Analyze this complaint and respond ONLY with valid JSON — no markdown, no explanation.

Complaint Title: "${title}"
Complaint Description: "${description}"

Respond with exactly this JSON structure:
{
  "category": "one of: murder, kidnapping, assault, terrorism, robbery, harassment, fraud, cybercrime, theft, vandalism, domestic_violence, missing_person, noise_complaint, traffic_issue, minor_dispute, other",
  "priority": "one of: High, Medium, Low",
  "priorityReason": "1-2 sentence explanation of why this priority was assigned",
  "summary": "concise 1-2 sentence summary of the complaint",
  "riskLevel": "one of: Critical, High, Medium, Low",
  "suggestedAction": "brief recommended action for police officer"
}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const parsed = extractJSON(text);

    if (!parsed || !parsed.priority || !parsed.category) {
      return fallback;
    }

    // Validate enum values
    const validPriorities = ['High', 'Medium', 'Low'];
    const validRiskLevels = ['Critical', 'High', 'Medium', 'Low'];
    const validCategories = [
      'murder', 'kidnapping', 'assault', 'terrorism', 'robbery',
      'harassment', 'fraud', 'cybercrime', 'theft', 'vandalism',
      'domestic_violence', 'missing_person', 'noise_complaint',
      'traffic_issue', 'minor_dispute', 'other',
    ];

    return {
      category: validCategories.includes(parsed.category) ? parsed.category : fallback.category,
      priority: validPriorities.includes(parsed.priority) ? parsed.priority : fallback.priority,
      priorityReason: parsed.priorityReason || fallback.priorityReason,
      summary: parsed.summary || fallback.summary,
      riskLevel: validRiskLevels.includes(parsed.riskLevel) ? parsed.riskLevel : 'Low',
      suggestedAction: parsed.suggestedAction || '',
      aiProcessed: true,
    };
  } catch (error) {
    console.error('Gemini analyzeComplaint error:', error.message);
    return { ...fallback, aiProcessed: false };
  }
};

/**
 * Chatbot response using Gemini
 * Returns: { reply, aiProcessed }
 */
const getChatbotReply = async (userMessage, conversationHistory = []) => {
  const fallbackReplies = {
    default: "I'm here to help with your complaint. Please describe your issue or ask about the complaint process.",
    track: "To track your complaint, go to the Track Complaint page and enter your Complaint ID (e.g., GRV-2024-000001).",
    category: "Common complaint categories include: Theft, Fraud, Harassment, Cybercrime, Assault, Noise Complaint, and Traffic Issue.",
    status: "Complaint statuses are: Pending (just filed), In Progress (being investigated), Resolved (completed), or Rejected (invalid).",
  };

  if (!genAI) {
    const lower = userMessage.toLowerCase();
    if (lower.includes('track')) return { reply: fallbackReplies.track, aiProcessed: false };
    if (lower.includes('category')) return { reply: fallbackReplies.category, aiProcessed: false };
    if (lower.includes('status')) return { reply: fallbackReplies.status, aiProcessed: false };
    return { reply: fallbackReplies.default, aiProcessed: false };
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Build conversation context
    const historyText = conversationHistory
      .slice(-6) // Last 6 messages for context
      .map(m => `${m.role === 'user' ? 'Citizen' : 'Assistant'}: ${m.content}`)
      .join('\n');

    const prompt = `You are a helpful police grievance portal assistant for Indian citizens.
Your job: help citizens file complaints, track status, understand categories, and use the portal.
Be concise (2-3 sentences max), helpful, and professional.
Never give legal advice. Always suggest filing a formal complaint for serious issues.
Always respond in the same language the user writes in.

${historyText ? `Conversation so far:\n${historyText}\n` : ''}
Citizen: ${userMessage}
Assistant:`;

    const result = await model.generateContent(prompt);
    const reply = result.response.text().trim();

    return {
      reply: reply || fallbackReplies.default,
      aiProcessed: true,
    };
  } catch (error) {
    console.error('Gemini chatbot error:', error.message);
    return { reply: fallbackReplies.default, aiProcessed: false };
  }
};

/**
 * Translate text to target language using Gemini
 * Returns translated string or original on failure
 */
const translateText = async (text, targetLanguage) => {
  if (!genAI || targetLanguage === 'en' || !text) return text;

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `Translate the following text to ${targetLanguage}. 
Return ONLY the translated text, nothing else:
"${text}"`;

    const result = await model.generateContent(prompt);
    return result.response.text().trim() || text;
  } catch {
    return text; // Fail silently, return original
  }
};

module.exports = { analyzeComplaint, getChatbotReply, translateText };
