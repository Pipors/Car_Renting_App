import { Request, Response } from "express";
import { fail, ok } from "../../utils/apiResponse";
import { reputationService } from "./reputation.service";

export const reputationController = {
  async rateRenter(req: Request, res: Response) {
    const result = await reputationService.rateRenter(req.user!.agencyId!, req.body);
    return res.status(201).json(ok({
      id: result.rating.id,
      rating: result.rating.rating,
      tags: result.rating.tags,
      renterNewAvgScore: result.reputation.avgScore
    }));
  },

  async getRenter(req: Request, res: Response) {
    const renterId = String(req.params.renterId);
    const data = await reputationService.getRenterReputation(renterId);
    if (!data) return res.status(404).json(fail("NOT_FOUND", "Renter not found"));
    return res.status(200).json(ok(data));
  },

  async getMine(req: Request, res: Response) {
    const data = await reputationService.getRenterReputation(req.user!.id);
    if (!data) return res.status(404).json(fail("NOT_FOUND", "Renter not found"));
    return res.status(200).json(ok(data));
  },

  async getRenterRatings(req: Request, res: Response) {
    const renterId = String(req.params.renterId);
    const result = await reputationService.getRenterRatings(renterId, req.query as Record<string, unknown>);
    return res.status(200).json(ok(result.data, undefined, result.meta));
  },

  async dispute(req: Request, res: Response) {
    const ratingId = String(req.params.ratingId);
    const dispute = await reputationService.dispute(req.user!.id, ratingId, req.body.reason);
    return res.status(201).json(ok({
      id: dispute.id,
      status: dispute.status,
      message: "Your dispute has been submitted. Admin will review within 48 hours."
    }));
  }
};
