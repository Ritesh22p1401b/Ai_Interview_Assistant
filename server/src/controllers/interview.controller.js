import { transcribeAudio } from "../services/whisper.service.js";
import { evaluateAnswer } from "../services/gemini.service.js";
import { Interview } from "../models/Interview.model.js";
import fs from "fs";


// ==========================================
// 🔹 GET Interview By ID (Fixes 404 issue)
// ==========================================
export const getInterviewById = async (req, res) => {
  try {
    const { id } = req.params;

    const interview = await Interview.findById(id);

    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    res.status(200).json(interview);

  } catch (error) {
    console.error("Get Interview Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// ==========================================
// 🔹 Submit Audio Answer
// ==========================================
export const submitAnswerAudio = async (req, res) => {
  try {
    const { interviewId, questionIndex } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Audio file is required" });
    }

    const filePath = req.file.path;

    // Validate interview
    const interview = await Interview.findById(interviewId);

    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    // Validate question index
    if (
      questionIndex === undefined ||
      questionIndex < 0 ||
      questionIndex >= interview.questions.length
    ) {
      return res.status(400).json({ message: "Invalid question index" });
    }

    const question = interview.questions[questionIndex];

    // 🔹 1. Transcribe Audio
    const transcript = await transcribeAudio(filePath);

    // 🔹 2. Evaluate Answer
    const evaluation = await evaluateAnswer(question, transcript);

    // 🔹 3. Save Answer
    interview.answers.push({
      question,
      audioUrl: filePath,
      transcript,
      score: evaluation.score,
      feedback: evaluation.feedback,
    });

    interview.totalScore =
      (interview.totalScore || 0) + (evaluation.score || 0);

    await interview.save();

    // 🔹 4. Delete temp file safely
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.status(200).json({
      transcript,
      score: evaluation.score,
      feedback: evaluation.feedback,
      totalScore: interview.totalScore,
    });

  } catch (error) {
    console.error("Submit Audio Error:", error);
    res.status(500).json({
      message: "Error processing audio",
      error: error.message,
    });
  }
};