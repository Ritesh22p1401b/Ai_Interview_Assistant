import mongoose from "mongoose";

const answerSchema = new mongoose.Schema({
  question: String,
  audioUrl: String,
  transcript: String,
  score: Number,
  feedback: String,
});

const interviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  resumeText: String,
  questions: [String],
  answers: [answerSchema],
  totalScore: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Interview = mongoose.model("Interview", interviewSchema);
