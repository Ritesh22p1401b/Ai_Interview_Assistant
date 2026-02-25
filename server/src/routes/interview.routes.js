// server/src/routes/interview.routes.js

import express from "express";
import {
  createInterview,
  getInterviewById,
  submitAnswerAudio,
  skipQuestion,
} from "../controllers/interview.controller.js";

import { protect } from "../middlewares/auth.middleware.js";
import { uploadAudio } from "../middlewares/audioUpload.js";

const router = express.Router();

/* ------------------ CREATE INTERVIEW ------------------ */
router.post("/create", protect, createInterview);

/* ------------------ SUBMIT AUDIO ANSWER ------------------ */
router.post(
  "/submit-audio",
  protect,
  uploadAudio.single("audio"),
  submitAnswerAudio
);

/* ------------------ SKIP QUESTION ------------------ */
router.post("/skip-question", protect, skipQuestion);

/* ------------------ GET INTERVIEW BY ID ------------------ */
/* Keep this LAST so it doesn't conflict with other routes */
router.get("/:id", protect, getInterviewById);

export default router;