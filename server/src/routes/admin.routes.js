import express from "express";
import {
  getAllCandidates,
  getTopper,
  getLeaderboard
} from "../controllers/admin.controller.js";

const router = express.Router();

/**
 * @route   GET /api/admin/candidates
 * @desc    Get all candidates with scores
 * @access  Admin
 */
router.get("/candidates", getAllCandidates);

/**
 * @route   GET /api/admin/topper
 * @desc    Get top scoring candidate
 * @access  Admin
 */
router.get("/topper", getTopper);

/**
 * @route   GET /api/admin/leaderboard
 * @desc    Get leaderboard (sorted)
 * @access  Admin
 */
router.get("/leaderboard", getLeaderboard);

export default router;
