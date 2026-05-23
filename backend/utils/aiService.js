const OpenAI = require('openai');

const client = process.env.OPENROUTER_API_KEY
  ? new OpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey: process.env.OPENROUTER_API_KEY,
    })
  : null;

const getChatbotReply = async (userMessage, conversationHistory = []) => {
  const fallback = "I'm here to help! Please describe your issue or ask about filing a complaint.";

  if (!client) return { reply: fallback, aiProcessed: false };

  try {
    const messages = [
      {
        role: 'system',
        content: `You are a helpful police grievance portal assistant for Indian citizens.
Help citizens file complaints, track status, understand categories, and use the portal.
Be concise (2-3 sentences max), helpful, and professional.
Never give legal advice. Always suggest filing a formal complaint for serious issues.
Always respond in the same language the user writes in.`,
      },
      ...conversationHistory.slice(-6).map(m => ({
        role: m.role === 'bot' ? 'assistant' : 'user',
        content: m.content,
      })),
      { role: 'user', content: userMessage },
    ];

    const completion = await client.chat.completions.create({
      model: 'google/gemma-3-4b-it:free',
      messages,
    });

    const reply = completion.choices[0]?.message?.content?.trim() || fallback;
    return { reply, aiProcessed: true };
  } catch (error) {
    console.error('OpenRouter chatbot error:', error.message);
    return { reply: fallback, aiProcessed: false };
  }
};

const analyzeComplaint = async (title, description, existingCategory = '') => {
  const fallback = {
    category: existingCategory || 'other',
    priority: 'Low',
    priorityReason: 'Priority assigned by keyword detection system.',
    summary: description ? description.substring(0, 120) + '...' : title,
    riskLevel: 'Low',
    aiProcessed: false,
  };

  if (!client) return fallback;

  try {
    const completion = await client.chat.completions.create({
      model: 'google/gemma-3-4b-it:free',
      messages: [
        {
          role: 'user',
          content: `You are a police complaint analysis AI for India.
Analyze this complaint and respond ONLY with valid JSON.

Title: "${title}"
Description: "${description}"

Respond with exactly this JSON:
{
  "category": "one of: murder, kidnapping, assault, terrorism, robbery, harassment, fraud, cybercrime, theft, vandalism, domestic_violence, missing_person, noise_complaint, traffic_issue, minor_dispute, other",
  "priority": "one of: High, Medium, Low",
  "priorityReason": "1-2 sentence explanation",
  "summary": "1-2 sentence summary",
  "riskLevel": "one of: Critical, High, Medium, Low",
  "suggestedAction": "brief recommended action"
}`,
        },
      ],
    });

    const text = completion.choices[0]?.message?.content || '';
    const cleaned = text.replace(/```json\n?/gi, '').replace(/```\n?/gi, '').trim();
    const parsed = JSON.parse(cleaned);

    const validPriorities = ['High', 'Medium', 'Low'];
    const validRiskLevels = ['Critical', 'High', 'Medium', 'Low'];
    const validCategories = [
      'murder','kidnapping','assault','terrorism','robbery',
      'harassment','fraud','cybercrime','theft','vandalism',
      'domestic_violence','missing_person','noise_complaint',
      'traffic_issue','minor_dispute','other',
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
    console.error('OpenRouter analyze error:', error.message);
    return { ...fallback, aiProcessed: false };
  }
};

const translateText = async (text, targetLanguage) => {
  if (!client || targetLanguage === 'en' || !text) return text;
  try {
    const completion = await client.chat.completions.create({
      model: 'google/gemma-3-4b-it:free',
      messages: [
        {
          role: 'user',
          content: `Translate to ${targetLanguage}. Return ONLY translated text: "${text}"`,
        },
      ],
    });
    return completion.choices[0]?.message?.content?.trim() || text;
  } catch {
    return text;
  }
};

module.exports = { analyzeComplaint, getChatbotReply, translateText };