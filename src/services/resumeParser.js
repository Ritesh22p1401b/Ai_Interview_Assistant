import fs from "fs";
import pdfParse from "pdf-parse";

export const extractResumeText = async (filePath) => {
  try {
    if (!filePath) {
      throw new Error("File path is missing");
    }

    if (!fs.existsSync(filePath)) {
      throw new Error("File does not exist");
    }

    const buffer = fs.readFileSync(filePath);

    const data = await pdfParse(buffer);

    const text = data?.text?.trim();

    if (!text || text.length < 20) {
      throw new Error("PDF contains no readable text");
    }

    return text;

  } catch (error) {
    console.error("Resume Parsing Error:", error);

    // Send clearer message to controller
    throw new Error(error.message || "Resume parsing failed");
  }
};
