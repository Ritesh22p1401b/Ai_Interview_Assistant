import { Interview } from "../models/Interview.model.js";
import { generateQuestions, evaluateAnswer } from "../services/gemini.service.js";
import { transcribeAudio } from "../services/whisper.service.js";
import fs from "fs";

/* ======================================================
   CREATE INTERVIEW
====================================================== */
export const createInterview = async (req, res) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { resumeText } = req.body;

    if (!resumeText || resumeText.length < 20) {
      return res.status(400).json({ message: "Valid resume text required" });
    }

    const { technical, project, behavioral } =
      await generateQuestions(resumeText);

    const allQuestions = [...technical, ...project, ...behavioral];

    if (allQuestions.length === 0) {
      return res.status(500).json({
        message: "Failed to generate interview questions",
      });
    }

    const interview = await Interview.create({
      user: req.user._id,
      resumeText,
      questions: { technical, project, behavioral },
      allQuestions,
      status: "in-progress",
      answers: [],
      totalScore: 0,
    });

    res.status(201).json({
      message: "Interview created successfully",
      interviewId: interview._id,
      questions: interview.allQuestions,
    });
  } catch (error) {
    console.error("Create Interview Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

/* ======================================================
   GET INTERVIEW
====================================================== */
export const getInterviewById = async (req, res) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const interview = await Interview.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    res.json(interview);
  } catch (error) {
    console.error("Get Interview Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

/* ======================================================
   SUBMIT ANSWER AUDIO
====================================================== */
export const submitAnswerAudio = async (req, res) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    let { interviewId, questionIndex } = req.body;
    questionIndex = Number(questionIndex);

    if (!req.file) {
      return res.status(400).json({ message: "Audio file required" });
    }

    if (isNaN(questionIndex)) {
      cleanupFile(req.file.path);
      return res.status(400).json({ message: "Invalid question index" });
    }

    const interview = await Interview.findOne({
      _id: interviewId,
      user: req.user._id,
    });

    if (!interview || interview.status === "completed") {
      cleanupFile(req.file.path);
      return res.status(400).json({ message: "Invalid interview state" });
    }

    if (
      questionIndex < 0 ||
      questionIndex >= interview.allQuestions.length
    ) {
      cleanupFile(req.file.path);
      return res.status(400).json({ message: "Question out of range" });
    }

    const question = interview.allQuestions[questionIndex];

    const alreadyAnswered = interview.answers.some(
      (ans) => ans.question === question
    );

    if (alreadyAnswered) {
      cleanupFile(req.file.path);
      return res.status(400).json({ message: "Question already handled" });
    }

    const transcript = await transcribeAudio(req.file.path);

    const evaluation = await evaluateAnswer(question, transcript);

    const score = evaluation?.score || 0;

    interview.answers.push({
      question,
      category: detectCategory(interview, question),
      audioUrl: "",
      transcript,
      score,
      feedback: evaluation?.feedback || "",
      skipped: false,
    });

    interview.totalScore =
      interview.answers.reduce((sum, a) => sum + (a.score || 0), 0);

    if (interview.answers.length === interview.allQuestions.length) {
      interview.status = "completed";
    }

    await interview.save();

    cleanupFile(req.file.path);

    res.json({
      transcript,
      score,
      totalScore: interview.totalScore,
      status: interview.status,
    });
  } catch (error) {
    console.error("Audio Submit Error:", error.message);
    res.status(500).json({ message: "Audio processing error" });
  }
};

/* ======================================================
   SKIP QUESTION
====================================================== */
export const skipQuestion = async (req, res) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    let { interviewId, questionIndex } = req.body;
    questionIndex = Number(questionIndex);

    if (isNaN(questionIndex)) {
      return res.status(400).json({ message: "Invalid question index" });
    }

    const interview = await Interview.findOne({
      _id: interviewId,
      user: req.user._id,
    });

    if (!interview || interview.status === "completed") {
      return res.status(400).json({ message: "Invalid interview state" });
    }

    if (
      questionIndex < 0 ||
      questionIndex >= interview.allQuestions.length
    ) {
      return res.status(400).json({ message: "Question out of range" });
    }

    const question = interview.allQuestions[questionIndex];

    const alreadyAnswered = interview.answers.some(
      (ans) => ans.question === question
    );

    if (alreadyAnswered) {
      return res.status(400).json({ message: "Question already handled" });
    }

    interview.answers.push({
      question,
      category: detectCategory(interview, question),
      audioUrl: "",
      transcript: "",
      score: 0,
      feedback: "Question skipped by user",
      skipped: true,
    });

    if (interview.answers.length === interview.allQuestions.length) {
      interview.status = "completed";
    }

    await interview.save();

    res.json({
      message: "Question skipped",
      totalScore: interview.totalScore,
      status: interview.status,
    });
  } catch (error) {
    console.error("Skip Question Error:", error.message);
    res.status(500).json({ message: "Skip failed" });
  }
};

/* ======================================================
   HELPERS
====================================================== */
const detectCategory = (interview, question) => {
  if (interview.questions?.technical?.includes(question)) return "technical";
  if (interview.questions?.project?.includes(question)) return "project";
  if (interview.questions?.behavioral?.includes(question)) return "behavioral";
  return "unknown";
};

const cleanupFile = (path) => {
  try {
    if (fs.existsSync(path)) {
      fs.unlinkSync(path);
    }
  } catch (err) {
    console.error("File cleanup failed:", err.message);
  }
};