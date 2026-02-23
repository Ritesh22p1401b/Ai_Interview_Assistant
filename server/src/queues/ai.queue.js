import { Queue } from "bullmq";
import { connection } from "../config/redis.js";

export const aiQueue = new Queue("ai-processing", {
  connection,
});