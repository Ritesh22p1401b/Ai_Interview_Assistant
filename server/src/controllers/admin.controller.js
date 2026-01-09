import Score from "../models/Score.model.js";
import User from "../models/User.model.js";

/**
 * Get all candidates
 */
export const getAllCandidates = async (req, res) => {
  try {
    const candidates = await Score.find()
      .populate("userId", "name email")
      .sort({ score: -1 });

    res.status(200).json(candidates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get topper
 */
export const getTopper = async (req, res) => {
  try {
    const topper = await Score.findOne()
      .populate("userId", "name email")
      .sort({ score: -1 });

    if (!topper) {
      return res.status(404).json({ message: "No scores found" });
    }

    res.status(200).json(topper);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get leaderboard
 */
export const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await Score.find()
      .populate("userId", "name")
      .sort({ score: -1 })
      .limit(10);

    res.status(200).json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
