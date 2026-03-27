import { GoogleGenAI } from "@google/genai";

/*
  The API key is automatically read from:
  process.env.GEMINI_API_KEY

  Make sure your .env contains:
  GEMINI_API_KEY=your_key_here
*/

const ai = new GoogleGenAI({});

/* ======================================================
   🔹 Utility: Safe JSON Extractor
====================================================== */
const extractJSON = (text) => {
  try {
    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const match = cleaned.match(/\{[\s\S]*\}/);

    if (!match) {
      throw new Error("No JSON found in Gemini response");
    }

    return JSON.parse(match[0]);
  } catch (error) {
    throw new Error("Failed to parse Gemini JSON response");
  }
};

/* ======================================================
   1️⃣ Generate Resume-Based Interview Questions
====================================================== */
export const generateQuestions = async (resumeText) => {
  try {
    if (!resumeText || resumeText.length < 50) {
      throw new Error("Resume text too short");
    }

    const prompt = `
You are a senior technical interviewer.

STRICT RULES:
- Questions must reference tools, frameworks, or projects mentioned in the resume.
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

    const text =
      response?.candidates?.[0]?.content?.parts?.[0]?.text ||
      response?.text;

    if (!text) {
      throw new Error("Empty Gemini response");
    }

    const parsed = extractJSON(text);

    return {
      technical: (parsed.technical || []).slice(0, 5),
      project: (parsed.project || []).slice(0, 3),
      behavioral: (parsed.behavioral || []).slice(0, 2),
    };
  } catch (error) {
    console.error("Gemini Question Generation Error:", error.message);
    throw new Error("Gemini question generation failed");
  }
};

/* ======================================================
   2️⃣ Evaluate Candidate Answer
====================================================== */
export const evaluateAnswer = async (question, transcript) => {
  try {
    if (!transcript || transcript.trim().length < 5) {
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

Candidate Answer:
${transcript}

Score from 0-10 on:
1. Technical accuracy
2. Communication clarity
3. Confidence
4. Relevance

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

    const text =
      response?.candidates?.[0]?.content?.parts?.[0]?.text ||
      response?.text;

    if (!text) {
      throw new Error("Empty Gemini response");
    }

    const parsed = extractJSON(text);

    // Defensive fallback
    return {
      score:
        typeof parsed.score === "number"
          ? Math.max(0, Math.min(10, parsed.score))
          : 0,
      feedback: parsed.feedback || "No feedback generated.",
      breakdown: {
        technicalAccuracy: parsed.breakdown?.technicalAccuracy ?? 0,
        communication: parsed.breakdown?.communication ?? 0,
        confidence: parsed.breakdown?.confidence ?? 0,
        relevance: parsed.breakdown?.relevance ?? 0,
      },
    };
  } catch (error) {
    console.error("Gemini Evaluation Error:", error.message);

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