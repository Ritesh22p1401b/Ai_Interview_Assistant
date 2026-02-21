import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// 🔐 Validate API key
if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY missing in .env file");
}

// New SDK client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const generateInterviewQuestions = async (resumeText) => {
  try {
    if (!resumeText || resumeText.length < 50) {
      throw new Error("Resume text too short");
    }

    const prompt = `
You are a senior technical interviewer.

Based strictly on this resume content, generate:
- 5 technical questions
- 3 project deep dive questions
- 2 behavioral questions

Return ONLY valid JSON in this format:

{
  "technical": [],
  "project": [],
  "behavioral": []
}

Resume:
${resumeText}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    let text = response.text;

    console.log("Gemini Raw Output:\n", text);

    // Remove markdown if present
    text = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsed = JSON.parse(text);

    if (!parsed.technical || !parsed.project || !parsed.behavioral) {
      throw new Error("Invalid JSON structure from Gemini");
    }

    return parsed;

  } catch (error) {
    console.error("Gemini Service Error:", error.message);
    throw new Error("Gemini AI failed");
  }
};