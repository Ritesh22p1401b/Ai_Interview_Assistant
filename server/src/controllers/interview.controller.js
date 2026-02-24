import { transcribeAudio } from "../services/whisper.service.js";
import { evaluateAnswer } from "../services/geminiEvaluation.service.js";
import { Interview } from "../models/Interview.model.js";
import fs from "fs";

export const submitAnswerAudio = async (req, res) => {
  try {
    const { interviewId, questionIndex } = req.body;
    const filePath = req.file.path;

    const transcript = await transcribeAudio(filePath);

    const interview = await Interview.findById(interviewId);

    const question = interview.questions[questionIndex];

    const evaluation = await evaluateAnswer(question, transcript);

    interview.answers.push({
      question,
      audioUrl: filePath,
      transcript,
      score: evaluation.score,
      feedback: evaluation.feedback,
    });

    interview.totalScore =
      (interview.totalScore || 0) + evaluation.score;

    await interview.save();

    fs.unlinkSync(filePath);

    res.json({
      transcript,
      score: evaluation.score,
      feedback: evaluation.feedback,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};