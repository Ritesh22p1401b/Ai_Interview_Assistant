// routes/resume.routes.js

import express from "express";
import { uploadResume } from "../controllers/resume.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";
import multer from "multer";

const router = express.Router();

router.post("/upload", protect, (req, res, next) => {
  const uploader = upload.single("file"); // 👈 must match frontend

  uploader(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({
        message: "File upload error",
        error: err.message,
      });
    } else if (err) {
      return res.status(400).json({
        message: err.message,
      });
    }

    next();
  });
}, uploadResume);

export default router;