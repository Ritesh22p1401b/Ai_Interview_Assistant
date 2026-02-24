import express from "express";
import { 
  submitAnswerAudio,
  getInterviewById 
} from "../controllers/interview.controller.js";
import { uploadAudio } from "../middlewares/audioUpload.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

// 🔹 Get interview by ID
router.get("/:id", protect, getInterviewById);

// 🔹 Submit audio answer
router.post(
  "/submit-audio",
  protect,
  uploadAudio.single("audio"),
  submitAnswerAudio
);

export default router;