import { Interview } from "../models/Interview.model.js";
import { generateQuestions, evaluateAnswer } from "../services/gemini.service.js";
import { transcribeAudio } from "../services/whisper.service.js";
import fs from "fs";

export const createInterview = async (req, res) => {
  try {
    const { resumeText } = req.body;
    if (!resumeText || resumeText.length < 20) {
      return res.status(400).json({ message: "Valid resume text required" });
    }
    const { technical, project, behavioral } = await generateQuestions(resumeText);

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

export const getInterviewById = async (req, res) => {
  try {
    const interview = await Interview.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!interview) return res.status(404).json({ message: "Interview not found" });
    res.json(interview);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/* Evaluates with AI only on SUBMIT */
export const submitAnswerAudio = async (req, res) => {
  try {
    let { interviewId, questionIndex } = req.body;
    questionIndex = Number(questionIndex);

    if (!req.file) return res.status(400).json({ message: "Audio file required" });

    const interview = await Interview.findOne({ _id: interviewId, user: req.user._id });
    if (!interview || interview.status === "completed") {
      if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: "Invalid interview state" });
    }

    const question = interview.allQuestions[questionIndex];
    const filePath = req.file.path;

    const alreadyAnswered = interview.answers.some((ans) => ans.question === question);
    if (alreadyAnswered) {
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      return res.status(400).json({ message: "Question already handled" });
    }

    // Transcribe and Evaluate with Gemini
    const transcript = await transcribeAudio(filePath);
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
    if (interview.answers.length === interview.allQuestions.length) interview.status = "completed";

    await interview.save();
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    res.json({ transcript, score: evaluation?.score || 0, totalScore: interview.totalScore, status: interview.status });
  } catch (error) {
    console.error("Audio Submit Error:", error);
    res.status(500).json({ message: "Audio processing error" });
  }
};

/* Awards 0 marks and bypasses AI evaluation on SKIP */
export const skipQuestion = async (req, res) => {
  try {
    let { interviewId, questionIndex } = req.body;
    questionIndex = Number(questionIndex);

    const interview = await Interview.findOne({ _id: interviewId, user: req.user._id });
    if (!interview || interview.status === "completed") {
      return res.status(400).json({ message: "Invalid interview state" });
    }

    const question = interview.allQuestions[questionIndex];
    const alreadyAnswered = interview.answers.some((ans) => ans.question === question);

    if (alreadyAnswered) return res.status(400).json({ message: "Question already handled" });

    // Directly push 0 score without calling evaluateAnswer service
    interview.answers.push({
      question,
      category: detectCategory(interview, question),
      audioUrl: "",
      transcript: "",
      score: 0,
      feedback: "Question skipped by user",
      skipped: true,
    });

    if (interview.answers.length === interview.allQuestions.length) interview.status = "completed";

    await interview.save();
    res.json({ message: "Question skipped", totalScore: interview.totalScore, status: interview.status });
  } catch (error) {
    res.status(500).json({ message: "Skip failed" });
  }
};

const detectCategory = (interview, question) => {
  if (interview.questions.technical.includes(question)) return "technical";
  if (interview.questions.project.includes(question)) return "project";
  return "behavioral";
};