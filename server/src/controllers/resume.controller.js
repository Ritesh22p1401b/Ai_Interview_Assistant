import Resume from "../models/Resume.model.js";
import { aiQueue } from "../queues/ai.queue.js";

export const uploadResume = async (req, res) => {
  try {
    const resume = await Resume.create({
      userId: req.user?._id,
      filePath: req.file.path,
    });

    await aiQueue.add("process-resume", {
      filePath: req.file.path,
    });

    res.status(202).json({
      message: "Resume uploaded. AI processing started.",
      interviewId: resume._id,   // 👈 IMPORTANT FIX
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Upload failed",
    });
  }
};