import express from "express";
import { upload } from "../middlewares/upload.middleware.js";
import { uploadResume } from "../controllers/resume.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import Interview from "../models/Interview.model.js";

const router = express.Router();

/**
 * Upload resume (Protected)
 * POST /api/resume/upload
 */
router.post(
  "/upload",
  protect,
  upload.single("resume"),
  uploadResume
);

/**
 * Debug: Get all interviews (Protected)
 */
router.get("/debug/interviews", protect, async (req, res) => {
  try {
    const interviews = await Interview.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });
    res.status(200).json(interviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * Get interview by ID (Protected)
 */
router.get("/interview/:id", protect, async (req, res) => {
  try {
    const interview = await Interview.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    res.status(200).json(interview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;