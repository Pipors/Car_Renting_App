import { NextFunction, Request, Response } from "express";
import { fail } from "../utils/apiResponse";

export const requireRole = (...roles: Array<"RENTER" | "AGENCY" | "ADMIN">) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json(fail("UNAUTHORIZED", "Authentication required"));
    }

    if (!roles.includes(req.user.userType)) {
      return res.status(403).json(fail("FORBIDDEN", "Insufficient permissions"));
    }

    return next();
  };
};
