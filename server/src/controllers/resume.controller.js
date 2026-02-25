// controllers/resume.controller.js
import fs from "fs";
import Resume from "../models/Resume.model.js";
import { Interview } from "../models/Interview.model.js";
import { generateQuestions } from "../services/gemini.service.js";

export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Resume file is required" });
    }

    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const filePath = req.file.path;

    // 🔥 Replace this with real PDF/DOC extraction logic
    const extractedText = fs.readFileSync(filePath, "utf8") || "Resume content";

    if (!extractedText || extractedText.length < 20) {
      return res.status(400).json({
        message: "Resume text extraction failed or empty file",
      });
    }

    // 1️⃣ Save resume
    const resume = await Resume.create({
      userId: req.user._id,
      fileName: req.file.originalname,
      filePath,
      extractedText,
    });

    // 2️⃣ Generate AI questions
    const { technical, project, behavioral } =
      await generateQuestions(extractedText);

    // 3️⃣ Create interview
    const interview = await Interview.create({
      user: req.user._id,
      resumeText: extractedText,
      questions: { technical, project, behavioral },
      allQuestions: [...technical, ...project, ...behavioral],
      status: "in-progress",
    });

    return res.status(201).json({
      message: "Resume uploaded and interview created",
      interviewId: interview._id,
      questions: interview.allQuestions,
    });

  } catch (error) {
    console.error("Resume Upload Error:", error);

    return res.status(500).json({
      message: "Resume upload failed",
      error: error.message,
    });
  }
};