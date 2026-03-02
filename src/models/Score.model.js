import mongoose from "mongoose";

const scoreSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    interviewId: { type: mongoose.Schema.Types.ObjectId, ref: "Interview" },

    totalScore: Number,

    breakdown: {
      technical: Number,
      project: Number,
      behavioral: Number,
      communication: Number,
      confidence: Number,
      relevance: Number,
    },

    recommendation: {
      type: String,
      enum: ["Strong Hire", "Hire", "Borderline", "Reject"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Score", scoreSchema);