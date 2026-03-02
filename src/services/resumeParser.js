import fs from "fs";
import { PDFParse } from "pdf-parse";

export const extractResumeText = async (filePath) => {
  try {
    console.log("Parsing file at path:", filePath);

    if (!fs.existsSync(filePath)) {
      throw new Error("File does not exist");
    }

    const buffer = fs.readFileSync(filePath);

    console.log("File size:", buffer.length);

    // ✅ pdf-parse v2 usage
    const parser = new PDFParse({ data: buffer });

    const result = await parser.getText();

    if (!result.text || result.text.trim().length === 0) {
      throw new Error("PDF has no readable text");
    }

    return result.text;

  } catch (error) {
    console.error("PDF Parsing Error:", error.message);
    throw new Error("Failed to parse PDF");
  }
};