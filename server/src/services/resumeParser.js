import fs from "fs";

export const extractResumeText = async (filePath) => {
  try {
    const pdf = (await import("pdf-parse")).default;

    const buffer = fs.readFileSync(filePath);
    const data = await pdf(buffer);

    return data.text;
  } catch (error) {
    console.error("PDF Parsing Error:", error);
    throw new Error("Failed to parse PDF");
  }
};