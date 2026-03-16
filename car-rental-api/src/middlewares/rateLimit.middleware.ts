import { NextFunction, Request, Response } from "express";
import { getRedis } from "../config/redis";
import { fail } from "../utils/apiResponse";

export const rateLimit = (namespace: string, max: number, windowSeconds: number) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const redis = getRedis();
      const key = `${namespace}:${req.ip}`;
      const count = await redis.incr(key);
      if (count === 1) {
        await redis.expire(key, windowSeconds);
      }
      if (count > max) {
        return res.status(429).json(fail("TOO_MANY_REQUESTS", "Rate limit exceeded"));
      }
      return next();
    } catch {
      return next();
    }
  };
};
