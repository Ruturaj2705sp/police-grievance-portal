const { analyzeComplaint: analyzeWithOpenRouter } = require('./aiService');

const analyzeComplaint = async (complaintText) => {
  try {
    const result = await analyzeWithOpenRouter(
      "Police Complaint",
      complaintText
    );

    return `
Priority: ${result.priority}
Category: ${result.category}
Reason: ${result.priorityReason}
Summary: ${result.summary}
`;
  } catch (error) {
    console.error("AI Analysis Error:", error.message);
    return "AI analysis failed";
  }
};

module.exports = analyzeComplaint;