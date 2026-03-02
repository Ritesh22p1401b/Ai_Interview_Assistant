import express from "express";
import {
  getAllCandidates,
  getTopper,
  getLeaderboard
} from "../controllers/admin.controller.js";
import { protect, adminOnly } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(protect, adminOnly);

router.get("/candidates", getAllCandidates);
router.get("/topper", getTopper);
router.get("/leaderboard", getLeaderboard);

export default router;
