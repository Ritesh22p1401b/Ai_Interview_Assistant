import express from "express";
import { submitAnswerAudio } from "../controllers/interview.controller.js";
import { uploadAudio } from "../middleware/audioUpload.js";

const router = express.Router();

router.post(
  "/submit-audio",
  uploadAudio.single("audio"),
  submitAnswerAudio
);

export default router;
