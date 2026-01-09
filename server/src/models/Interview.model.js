import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    questions: [String],
    answers: [String],
    completed: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model("Interview", interviewSchema);
