import Redis from "ioredis";
import { env } from "./env";

let redisClient: Redis | null = null;

export const getRedis = (): Redis => {
  if (!redisClient) {
    redisClient = new Redis(env.REDIS_URL, {
      maxRetriesPerRequest: 1,
      enableReadyCheck: false
    });
    redisClient.on("error", () => {
      // Intentionally swallow Redis errors in MVP mode to avoid taking API down.
    });
  }

  return redisClient;
};
