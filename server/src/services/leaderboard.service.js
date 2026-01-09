import { redisClient } from "../config/redis.js";

export const updateLeaderboard = async (userId, score) => {
  await redisClient.zAdd("leaderboard", {
    score,
    value: userId.toString()
  });
};

export const getTopper = async () => {
  return redisClient.zRange("leaderboard", 0, 0, { REV: true });
};
