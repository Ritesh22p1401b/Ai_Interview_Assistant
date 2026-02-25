// controllers/interview.controller.js

import { Interview } from "../models/Interview.model.js";
import { generateQuestions, evaluateAnswer } from "../services/gemini.service.js";
import { transcribeAudio } from "../services/whisper.service.js";
import fs from "fs";

/* ===================================================== */
export const createInterview = async (req, res) => {
  try {
    const { resumeText } = req.body;

    if (!resumeText || resumeText.length < 20) {
      return res.status(400).json({ message: "Valid resume text required" });
    }

    const { technical, project, behavioral } =
      await generateQuestions(resumeText);

    const interview = await Interview.create({
      user: req.user._id,
      resumeText,
      questions: { technical, project, behavioral },
      allQuestions: [...technical, ...project, ...behavioral],
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
    console.error("Create Interview Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ===================================================== */
export const getInterviewById = async (req, res) => {
  try {
    const interview = await Interview.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    res.json(interview);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ===================================================== */
export const submitAnswerAudio = async (req, res) => {
  try {
    let { interviewId, questionIndex } = req.body;

    questionIndex = Number(questionIndex);

    if (!req.file) {
      return res.status(400).json({ message: "Audio file required" });
    }

    const interview = await Interview.findOne({
      _id: interviewId,
      user: req.user._id,
    });

    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    if (interview.status === "completed") {
      return res.status(400).json({ message: "Interview already completed" });
    }

    if (
      isNaN(questionIndex) ||
      questionIndex < 0 ||
      questionIndex >= interview.allQuestions.length
    ) {
      return res.status(400).json({ message: "Invalid question index" });
    }

    const question = interview.allQuestions[questionIndex];
    const filePath = req.file.path;

    /* ---------- DUPLICATE PROTECTION ---------- */
    const alreadyAnswered = interview.answers.some(
      (ans) => ans.question === question
    );

    if (alreadyAnswered) {
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      return res.status(400).json({ message: "Question already answered" });
    }

    /* ---------- TRANSCRIBE ---------- */
    const transcript = await transcribeAudio(filePath);

    /* ---------- EVALUATE ---------- */
    const evaluation = await evaluateAnswer(question, transcript);

    interview.answers.push({
      question,
      category: detectCategory(interview, question),
      audioUrl: filePath,
      transcript,
      score: evaluation?.score || 0,
      feedback: evaluation?.feedback || "",
      skipped: false,
    });

    interview.totalScore += evaluation?.score || 0;

    if (interview.answers.length === interview.allQuestions.length) {
      interview.status = "completed";
    }

    await interview.save();

    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    res.json({
      transcript,
      score: evaluation?.score || 0,
      feedback: evaluation?.feedback || "",
      totalScore: interview.totalScore,
      status: interview.status,
    });

  } catch (error) {
    console.error("Audio Submit Error:", error);
    res.status(500).json({ message: "Audio processing error" });
  }
};

/* ===================================================== */
export const skipQuestion = async (req, res) => {
  try {
    let { interviewId, questionIndex } = req.body;

    questionIndex = Number(questionIndex);

    const interview = await Interview.findOne({
      _id: interviewId,
      user: req.user._id,
    });

    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    if (interview.status === "completed") {
      return res.status(400).json({ message: "Interview already completed" });
    }

    if (
      isNaN(questionIndex) ||
      questionIndex < 0 ||
      questionIndex >= interview.allQuestions.length
    ) {
      return res.status(400).json({ message: "Invalid question index" });
    }

    const question = interview.allQuestions[questionIndex];

    /* ---------- PREVENT DUPLICATE SKIP ---------- */
    const alreadyAnswered = interview.answers.some(
      (ans) => ans.question === question
    );

    if (alreadyAnswered) {
      return res.status(400).json({ message: "Question already answered" });
    }

    interview.answers.push({
      question,
      category: detectCategory(interview, question),
      audioUrl: "",
      transcript: "",
      score: 0,
      feedback: "Question skipped",
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
    console.error("Skip Question Error:", error);
    res.status(500).json({ message: "Skip failed" });
  }
};

/* ===================================================== */
const detectCategory = (interview, question) => {
  if (interview.questions.technical.includes(question)) return "technical";
  if (interview.questions.project.includes(question)) return "project";
  if (interview.questions.behavioral.includes(question)) return "behavioral";
  return "technical";
};