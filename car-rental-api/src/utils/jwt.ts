import jwt from "jsonwebtoken";
import { env } from "../config/env";

type AccessPayload = {
  id: string;
  email: string;
  userType: "RENTER" | "AGENCY" | "ADMIN";
  agencyId?: string;
};

export const signAccessToken = (payload: AccessPayload) =>
  jwt.sign(payload, env.JWT_ACCESS_SECRET, { expiresIn: env.JWT_ACCESS_EXPIRES_IN as any });

export const signRefreshToken = (payload: AccessPayload) =>
  jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: env.JWT_REFRESH_EXPIRES_IN as any });

export const verifyAccessToken = (token: string) =>
  jwt.verify(token, env.JWT_ACCESS_SECRET) as AccessPayload;

export const verifyRefreshToken = (token: string) =>
  jwt.verify(token, env.JWT_REFRESH_SECRET) as AccessPayload;
