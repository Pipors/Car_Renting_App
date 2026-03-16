import { NextFunction, Request, Response } from "express";
import { prisma } from "../config/database";
import { fail } from "../utils/apiResponse";
import { verifyAccessToken } from "../utils/jwt";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json(fail("UNAUTHORIZED", "Missing access token"));
  }

  try {
    const payload = verifyAccessToken(token);
    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      include: { agency: true }
    });

    if (!user) {
      return res.status(401).json(fail("UNAUTHORIZED", "Invalid access token"));
    }

    if (user.isBanned) {
      return res.status(403).json(fail("FORBIDDEN", "User account is banned"));
    }

    req.user = {
      id: user.id,
      email: user.email,
      userType: user.userType,
      agencyId: user.agency?.id
    };

    return next();
  } catch {
    return res.status(401).json(fail("UNAUTHORIZED", "Invalid access token"));
  }
};
