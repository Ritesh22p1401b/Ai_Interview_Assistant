import { Worker } from "bullmq";
import { connection } from "../config/redis.js";
import { parseResume } from "../services/resume.parser.js";
import { generateQuestions } from "../services/ai.engine.js";

new Worker(
  "ai-processing",
  async (job) => {
    const { filePath } = job.data;

    const resumeText = await parseResume(filePath);
    const questions = await generateQuestions(resumeText);

    return { resumeText, questions };
  },
  { connection }
);
