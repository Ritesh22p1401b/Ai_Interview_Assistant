import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    fileName: String,
    filePath: String
  },
  { timestamps: true }
);

export default mongoose.model("Resume", resumeSchema);
