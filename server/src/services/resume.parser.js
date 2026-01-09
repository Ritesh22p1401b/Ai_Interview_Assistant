import fs from "fs";
import pdf from "pdf-parse";
import mammoth from "mammoth";

export const parseResume = async (filePath) => {
  if (filePath.endsWith(".pdf")) {
    const data = await pdf(fs.readFileSync(filePath));
    return data.text;
  }

  if (filePath.endsWith(".docx")) {
    const data = await mammoth.extractRawText({ path: filePath });
    return data.value;
  }

  throw new Error("Unsupported file format");
};
