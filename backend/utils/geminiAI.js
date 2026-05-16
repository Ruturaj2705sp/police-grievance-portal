const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const analyzeComplaint = async (complaintText) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const prompt = `
Analyze this police complaint carefully.

Return ONLY in this format:

Priority: HIGH or MEDIUM or LOW
Category: category name
Reason: why this priority was assigned
Summary: short summary

Complaint:
${complaintText}
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