import { Request, Response } from "express";
import { ok } from "../../utils/apiResponse";
import { reviewsService } from "../reviews/reviews.service";
import { adminService } from "./admin.service";

export const adminController = {
  async users(req: Request, res: Response) {
    const result = await adminService.users(req.query as Record<string, unknown>);
    return res.status(200).json(ok(result.data, undefined, result.meta));
  },

  async banUser(req: Request, res: Response) {
    const userId = String(req.params.id);
    const user = await adminService.banUser(userId, req.body.banned, req.body.reason);
    return res.status(200).json(ok(user));
  },

  async agencies(req: Request, res: Response) {
    const result = await adminService.agencies(req.query as Record<string, unknown>);
    return res.status(200).json(ok(result.data, undefined, result.meta));
  },

  async approveAgency(req: Request, res: Response) {
    const agencyId = String(req.params.id);
    const agency = await adminService.approveAgency(agencyId, req.body.approved);
    return res.status(200).json(ok(agency));
  },

  async bookings(req: Request, res: Response) {
    const result = await adminService.bookings(req.query as Record<string, unknown>);
    return res.status(200).json(ok(result.data, undefined, result.meta));
  },

  async disputes(req: Request, res: Response) {
    const result = await adminService.disputes(req.query as Record<string, unknown>);
    return res.status(200).json(ok(result.data, undefined, result.meta));
  },

  async resolveDispute(req: Request, res: Response) {
    const disputeId = String(req.params.id);
    const dispute = await adminService.resolveDispute(disputeId, req.body);
    return res.status(200).json(ok(dispute));
  },

  async removeReview(req: Request, res: Response) {
    const reviewId = String(req.params.id);
    await reviewsService.hide(reviewId);
    return res.status(204).send();
  }
};
