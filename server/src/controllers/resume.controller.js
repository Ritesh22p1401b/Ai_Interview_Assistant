// controllers/resume.controller.js
import Resume from "../models/Resume.model.js";
import { Interview } from "../models/Interview.model.js";
import { generateQuestions } from "../services/gemini.service.js";
import { extractResumeText } from "../services/resumeParser.js";

export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Resume file is required" });
    }

    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const filePath = req.file.path;

    // ✅ Use proper resume parser instead of fs.readFileSync
    const extractedText = await extractResumeText(filePath);

    if (!extractedText || extractedText.length < 20) {
      return res.status(400).json({
        message: "Resume text extraction failed or empty file",
      });
    }

    // Save resume
    const resume = await Resume.create({
      userId: req.user._id,
      fileName: req.file.originalname,
      filePath,
      extractedText,
    });

    // Generate questions
    const { technical, project, behavioral } =
      await generateQuestions(extractedText);

    const allQuestions = [...technical, ...project, ...behavioral];

    if (allQuestions.length === 0) {
      return res.status(500).json({
        message: "AI failed to generate questions",
      });
    }

    // Create interview
    const interview = await Interview.create({
      user: req.user._id,
      resumeText: extractedText,
      questions: { technical, project, behavioral },
      allQuestions,
      status: "in-progress",
      answers: [],
      totalScore: 0,
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