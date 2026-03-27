// models/Interview.model.js
import mongoose from "mongoose";

const answerSchema = new mongoose.Schema({
  question: { type: String, required: true },
  category: {
    type: String,
    enum: ["technical", "project", "behavioral"],
    required: true,
  },
  audioUrl: String,
  transcript: String,
  score: { type: Number, default: 0 },
  feedback: String,
  answeredAt: { type: Date, default: Date.now },
});

const interviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    resumeText: {
      type: String,
      required: true,
    },

    questions: {
      technical: [String],
      project: [String],
      behavioral: [String],
    },

    allQuestions: [String],

    answers: [answerSchema],

    totalScore: { type: Number, default: 0 },

    status: {
      type: String,
      enum: ["in-progress", "completed"],
      default: "in-progress",
    },
  },
  { timestamps: true }
);

export const Interview = mongoose.model("Interview", interviewSchema);