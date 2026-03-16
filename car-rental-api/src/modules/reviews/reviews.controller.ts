import { Request, Response } from "express";
import { fail, ok } from "../../utils/apiResponse";
import { reviewsService } from "./reviews.service";

export const reviewsController = {
  async createAgencyReview(req: Request, res: Response) {
    const review = await reviewsService.create(req.user!.id, req.body);
    return res.status(201).json(ok(review));
  },

  async byAgency(req: Request, res: Response) {
    const agencyId = String(req.params.agencyId);
    const result = await reviewsService.byAgency(agencyId, req.query as Record<string, unknown>);
    return res.status(200).json(ok(result.data, undefined, result.meta));
  },

  async byId(req: Request, res: Response) {
    const reviewId = String(req.params.id);
    const review = await reviewsService.byId(reviewId);
    if (!review) return res.status(404).json(fail("NOT_FOUND", "Review not found"));
    return res.status(200).json(ok(review));
  },

  async remove(req: Request, res: Response) {
    const reviewId = String(req.params.id);
    await reviewsService.hide(reviewId);
    return res.status(204).send();
  }
};
