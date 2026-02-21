import Resume from "../models/Resume.model.js";
import Interview from "../models/Interview.model.js";
import { extractResumeText } from "../services/resumeParser.js";
import { generateInterviewQuestions } from "../services/gemini.service.js";

export const uploadResume = async (req, res) => {
  try {
    // 🔒 Safety checks
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No resume file uploaded" });
    }

    // 1️⃣ Save Resume
    const resume = await Resume.create({
      userId: req.user._id,
      filePath: req.file.path,
    });

    // 2️⃣ Extract Resume Text
    const resumeText = await extractResumeText(req.file.path);

    if (!resumeText || resumeText.length < 50) {
      return res.status(400).json({
        message: "Resume text extraction failed or file is empty",
      });
    }

    // 3️⃣ Generate AI Questions
    const questionsData = await generateInterviewQuestions(resumeText);

    if (!questionsData) {
      return res.status(500).json({
        message: "Failed to generate interview questions",
      });
    }

    const allQuestions = [
      ...(questionsData.technical || []),
      ...(questionsData.project || []),
      ...(questionsData.behavioral || []),
    ];

    // 4️⃣ Create Interview
    const interview = await Interview.create({
      userId: req.user._id,
      questions: allQuestions,
      answers: [],
    });

    res.status(201).json({
      message: "Resume uploaded and interview generated",
      interviewId: interview._id,
      questions: allQuestions,
    });
  } catch (error) {
    console.error("Upload Resume Error:", error);
    res.status(500).json({
      message: "AI interview generation failed",
      error: error.message,
    });
  }
};