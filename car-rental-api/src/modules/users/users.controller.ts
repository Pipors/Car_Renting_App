import { Request, Response } from "express";
import { fail, ok } from "../../utils/apiResponse";
import { usersService } from "./users.service";

export const usersController = {
  async getMe(req: Request, res: Response) {
    const user = await usersService.getMe(req.user!.id);
    if (!user) {
      return res.status(404).json(fail("NOT_FOUND", "User not found"));
    }
    return res.status(200).json(ok(user));
  },

  async updateMe(req: Request, res: Response) {
    const updated = await usersService.updateMe(req.user!.id, req.body);
    if (!updated) {
      return res.status(404).json(fail("NOT_FOUND", "User not found"));
    }
    return res.status(200).json(ok(updated, "Profile updated"));
  },

  async sendPhoneOtp(req: Request, res: Response) {
    await usersService.sendPhoneOtp(req.user!.id);
    return res.status(200).json(ok(null, "OTP sent"));
  },

  async verifyPhone(req: Request, res: Response) {
    await usersService.verifyPhone(req.user!.id, req.body.otp);
    return res.status(200).json(ok(null, "Phone verified"));
  }
};
