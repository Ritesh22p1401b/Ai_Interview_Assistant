import express from "express";
import {
  createInterview,
  getInterviewById,
  submitAnswerAudio,
} from "../controllers/interview.controller.js";

import { protect } from "../middlewares/auth.middleware.js";
import { uploadAudio } from "../middlewares/audioUpload.js";

const router = express.Router();

router.post("/create", protect, createInterview);

router.get("/:id", protect, getInterviewById);

router.post(
  "/submit-audio",
  protect,
  uploadAudio.single("audio"),
  submitAnswerAudio
);

export default router;
