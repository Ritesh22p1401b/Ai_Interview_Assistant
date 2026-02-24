import mongoose from "mongoose";

const answerSchema = new mongoose.Schema({
  question: { type: String, required: true },

  category: {
    type: String,
    enum: ["technical", "project", "behavioral"],
    required: true,
  },

  
  audioUrl: { type: String },
  audioDuration: { type: Number }, // seconds

  
  transcript: { type: String },

  score: { type: Number, default: 0 },
  feedback: { type: String },

  evaluationBreakdown: {
    technicalAccuracy: { type: Number, default: 0 },
    communication: { type: Number, default: 0 },
    confidence: { type: Number, default: 0 },
    relevance: { type: Number, default: 0 },
  },

  answeredAt: { type: Date, default: Date.now },
});

const interviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    resumeText: { type: String },

    questions: {
      technical: [String],
      project: [String],
      behavioral: [String],
    },

    allQuestions: [String],

    answers: [answerSchema],

    totalScore: { type: Number, default: 0 },

    categoryScores: {
      technical: { type: Number, default: 0 },
      project: { type: Number, default: 0 },
      behavioral: { type: Number, default: 0 },
    },

    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      default: "pending",
    },

    startedAt: Date,
    completedAt: Date,
  },
  { timestamps: true }
);

export const Interview = mongoose.model("Interview", interviewSchema);