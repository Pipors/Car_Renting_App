import { Request, Response } from "express";
import { ok } from "../../utils/apiResponse";
import { paymentsService } from "./payments.service";

export const paymentsController = {
  async createIntent(req: Request, res: Response) {
    const result = await paymentsService.createIntent(req.user!.id, req.body.bookingId);
    return res.status(201).json(ok(result));
  },

  async confirm(req: Request, res: Response) {
    const result = await paymentsService.confirm(req.user!.id, req.body.bookingId, req.body.paymentIntentId);
    return res.status(200).json(ok(result));
  },

  async release(req: Request, res: Response) {
    const result = await paymentsService.release(req.user!.agencyId!, req.body.bookingId);
    return res.status(200).json(ok(result));
  },

  async deduct(req: Request, res: Response) {
    const result = await paymentsService.deduct(req.user!.agencyId!, req.body.bookingId, req.body.deductAmount, req.body.reason);
    return res.status(200).json(ok(result));
  },

  async listMine(req: Request, res: Response) {
    const result = await paymentsService.listMine(req.user!, req.query as Record<string, unknown>);
    return res.status(200).json(ok(result.data, undefined, result.meta));
  },

  async webhook(req: Request, res: Response) {
    await paymentsService.stripeWebhook(req.body.type, req.body.paymentIntentId);
    return res.status(200).json(ok({ received: true }));
  }
};
