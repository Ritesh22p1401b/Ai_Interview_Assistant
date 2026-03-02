import IORedis from "ioredis";

const redis = new IORedis(process.env.REDIS_URL);

export const updateLeaderboard = async (userId, score) => {
  await redis.zAdd("leaderboard", {
    score,
    value: userId.toString()
  });
};

export const getLeaderboard = async () => {
  return redis.zRange("leaderboard", 0, 9, { REV: true });
};
