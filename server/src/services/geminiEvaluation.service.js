import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const evaluateAnswer = async (question, answer) => {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `
You are an AI technical interviewer.

Question:
${question}

Candidate Answer:
${answer}

Give:
1. Score out of 10
2. Short feedback

Respond in JSON:
{
  "score": number,
  "feedback": "text"
}
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  return JSON.parse(text);
};
