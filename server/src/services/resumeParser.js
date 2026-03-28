import fs from "fs";
import { PDFParse } from "pdf-parse";

export const extractResumeText = async (filePath) => {
  try {
    if (!filePath) {
      throw new Error("File path missing");
    }

    if (!fs.existsSync(filePath)) {
      throw new Error("Resume file not found");
    }

    // Read uploaded resume
    const buffer = fs.readFileSync(filePath);

    // Initialize parser with buffer
    const parser = new PDFParse({ data: buffer });

    // Extract text
    const result = await parser.getText();

    const text = result?.text?.trim();

    if (!text || text.length < 20) {
      throw new Error("PDF contains no readable text");
    }

    return text;

  } catch (error) {
    console.error("Resume Parsing Error:", error);

    throw new Error(error.message || "Resume parsing failed");
  }
};