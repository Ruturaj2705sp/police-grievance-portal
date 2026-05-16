const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const analyzeComplaint = async (complaintText) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
    Analyze this police complaint and return:
    1. Priority (HIGH, MEDIUM, LOW)
    2. Category
    3. Short summary

    Complaint:
    ${complaintText}

    Format:
    Priority:
    Category:
    Summary:
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();

  } catch (error) {
    console.error("Gemini AI Error:", error);
    return "AI analysis failed";
  }
};

module.exports = analyzeComplaint;