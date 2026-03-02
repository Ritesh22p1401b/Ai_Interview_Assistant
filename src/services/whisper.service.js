import fs from "fs";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

/**
 * Transcribe audio using Gemini 2.5 Flash
 * @param {string} filePath
 * @param {string} mimeType
 * @returns {string}
 */
export async function transcribeAudio(filePath, mimeType = "audio/webm") {
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error("Audio file not found");
    }

    const audioBuffer = fs.readFileSync(filePath);
    const base64Audio = audioBuffer.toString("base64");

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `
You are an accurate speech-to-text transcription engine.
Transcribe the following interview answer exactly as spoken.
Return only the transcript text.
Do not summarize.
Do not explain.
              `,
            },
            {
              inlineData: {
                mimeType,
                data: base64Audio,
              },
            },
          ],
        },
      ],
    });

    if (!response.text) {
      throw new Error("Empty transcription returned.");
    }

    return response.text.trim();
  } catch (error) {
    console.error("Gemini 2.5 Flash Transcription Error:", error);
    throw error;
  }
}