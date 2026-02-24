import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    fileName: String,
    filePath: String,

    extractedText: String, // 🔥 Needed for AI generation
  },
  { timestamps: true }
);

export default mongoose.model("Resume", resumeSchema);