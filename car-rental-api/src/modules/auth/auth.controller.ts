import { Request, Response } from "express";
import { env } from "../../config/env";
import { fail, ok } from "../../utils/apiResponse";
import { authService } from "./auth.service";

const cookieOptions = {
  httpOnly: true,
  sameSite: "strict" as const,
  secure: env.NODE_ENV === "production",
  maxAge: 48 * 60 * 60 * 1000
};

export const authController = {
  async register(req: Request, res: Response) {
    const result = await authService.register(req.body);
    res.cookie(authService.refreshTokenCookie, result.refreshToken, cookieOptions);
    return res.status(201).json(ok({ user: result.user, accessToken: result.accessToken }, "Account created successfully"));
  },

  async login(req: Request, res: Response) {
    const result = await authService.login(req.body.email, req.body.password);
    if (!result) {
      return res.status(401).json(fail("UNAUTHORIZED", "Invalid email or password"));
    }
    res.cookie(authService.refreshTokenCookie, result.refreshToken, cookieOptions);
    return res.status(200).json(ok({ user: result.user, accessToken: result.accessToken }));
  },

  async refresh(req: Request, res: Response) {
    const refreshToken = req.cookies?.[authService.refreshTokenCookie];
    if (!refreshToken) {
      return res.status(401).json(fail("UNAUTHORIZED", "Missing refresh token"));
    }

    const result = await authService.refresh(refreshToken);
    res.cookie(authService.refreshTokenCookie, result.refreshToken, cookieOptions);
    return res.status(200).json(ok({ accessToken: result.accessToken }));
  },

  async logout(req: Request, res: Response) {
    const refreshToken = req.cookies?.[authService.refreshTokenCookie];
    await authService.logout(refreshToken);
    res.clearCookie(authService.refreshTokenCookie);
    return res.status(200).json(ok(null, "Logged out"));
  },

  async forgotPassword(req: Request, res: Response) {
    await authService.forgotPassword(req.body.email);
    return res.status(200).json(ok(null, "If account exists, OTP has been sent"));
  },

  async resetPassword(req: Request, res: Response) {
    await authService.resetPassword(req.body.email, req.body.otp, req.body.newPassword);
    return res.status(200).json(ok(null, "Password reset successful"));
  }
};
