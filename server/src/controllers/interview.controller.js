import Interview from "../models/Interview.model.js";
import Score from "../models/Score.model.js";

export const startInterview = async (req, res) => {
  const questions = [
    "Explain your last project",
    "What is REST API?",
    "Explain MongoDB indexing"
  ];

  const interview = await Interview.create({
    userId: req.body.userId,
    questions
  });

  res.json(interview);
};

export const submitInterview = async (req, res) => {
  const { interviewId, answers } = req.body;

  const interview = await Interview.findByIdAndUpdate(
    interviewId,
    { answers, completed: true },
    { new: true }
  );

  const scoreValue = Math.floor(Math.random() * 40) + 60;

  const score = await Score.create({
    userId: interview.userId,
    interviewId,
    score: scoreValue,
    breakdown: {
      technical: 80,
      communication: 75,
      confidence: 70,
      relevance: 85
    }
  });

  res.json({ interview, score });
};
