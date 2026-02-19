// config/redis.js
import IORedis from "ioredis";

export const redisClient = new IORedis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
});

redisClient.on("connect", () => {
  console.log("✅ Redis connected");
});

redisClient.on("error", (err) => {
  console.error("❌ Redis error:", err.message);
});
