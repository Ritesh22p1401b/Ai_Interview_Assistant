import mongoose from "mongoose";

const scoreSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    interviewId: { type: mongoose.Schema.Types.ObjectId, ref: "Interview" },
    score: Number,
    breakdown: {
      technical: Number,
      communication: Number,
      confidence: Number,
      relevance: Number
    }
  },
  { timestamps: true }
);

export default mongoose.model("Score", scoreSchema);
