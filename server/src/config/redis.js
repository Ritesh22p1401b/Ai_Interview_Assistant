import Redis from "redis";

export const redisClient = Redis.createClient({
  url: process.env.REDIS_URL
});

redisClient.connect();
