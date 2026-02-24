import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY missing in .env file");
}

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

/* ---------------------------------------------------------
   Utility: Safe JSON Extractor
---------------------------------------------------------- */
const extractJSON = (text) => {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("No valid JSON found in Gemini response");
  return JSON.parse(match[0]);
};

/* ---------------------------------------------------------
   1️⃣ Generate Resume-Based Questions
---------------------------------------------------------- */
export const generateInterviewQuestions = async (resumeText) => {
  try {
    if (!resumeText || resumeText.length < 50) {
      throw new Error("Resume text too short");
    }

    const prompt = `
You are a senior technical interviewer.

STRICT RULES:
- Questions must directly reference tools, frameworks, or projects mentioned in the resume.
- Do NOT ask generic questions.
- Do NOT number the questions.
- Return ONLY raw JSON.

Generate:
- 5 technical questions
- 3 project deep dive questions
- 2 behavioral questions

Return EXACT JSON format:

{
  "technical": ["", "", "", "", ""],
  "project": ["", "", ""],
  "behavioral": ["", ""]
}

Resume:
${resumeText}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      temperature: 0.4,
    });

    let text = response.text;

    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    const parsed = extractJSON(text);

    return {
      technical: parsed.technical.slice(0, 5),
      project: parsed.project.slice(0, 3),
      behavioral: parsed.behavioral.slice(0, 2),
    };

  } catch (error) {
    console.error("Question Generation Error:", error.message);
    throw new Error("Gemini question generation failed");
  }
};

/* ---------------------------------------------------------
   2️⃣ Evaluate Audio Answer
---------------------------------------------------------- */
export const evaluateAnswer = async (question, transcript) => {
  try {
    if (!transcript || transcript.length < 5) {
      return {
        score: 0,
        feedback: "No meaningful answer detected.",
        breakdown: {
          technicalAccuracy: 0,
          communication: 0,
          confidence: 0,
          relevance: 0,
        },
      };
    }

    const prompt = `
You are an expert AI interviewer.

Evaluate the candidate's answer.

Question:
${question}

Candidate Answer (transcript):
${transcript}

Evaluate based on:
1. Technical accuracy (0-10)
2. Communication clarity (0-10)
3. Confidence (0-10)
4. Relevance to question (0-10)

Then compute an overall score (0-10).

Return ONLY valid JSON:

{
  "score": number,
  "feedback": "short paragraph feedback",
  "breakdown": {
    "technicalAccuracy": number,
    "communication": number,
    "confidence": number,
    "relevance": number
  }
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      temperature: 0.3,
    });

    let text = response.text;

    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    const parsed = extractJSON(text);

    return parsed;

  } catch (error) {
    console.error("Evaluation Error:", error.message);

    return {
      score: 0,
      feedback: "AI evaluation failed.",
      breakdown: {
        technicalAccuracy: 0,
        communication: 0,
        confidence: 0,
        relevance: 0,
      },
    };
  }
};