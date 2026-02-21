import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

export const generateInterviewQuestions = async (resumeText) => {
  const prompt = `
You are a senior technical interviewer.

Based strictly on this resume content, generate:
- 5 technical questions
- 3 project deep dive questions
- 2 behavioral questions

Return ONLY valid JSON.

{
  "technical": [],
  "project": [],
  "behavioral": []
}

Resume:
${resumeText}
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // 🔥 Clean markdown if Gemini wraps it
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Error:", error.message);
    throw new Error("Gemini AI failed");
  }
};