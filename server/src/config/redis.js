import Redis from "redis";
import IORedis from "ioredis";

export const connection = new IORedis(process.env.REDIS_URL);
export const redisClient = Redis.createClient({
  url: process.env.REDIS_URL
});

redisClient.connect();
