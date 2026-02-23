import express from "express";
import { getInterviewById } from "../controllers/interview.controller.js";

const router = express.Router();

// GET interview by ID
router.get("/:id", getInterviewById);

export default router;