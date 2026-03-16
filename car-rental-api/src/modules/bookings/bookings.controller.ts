import { Request, Response } from "express";
import { fail, ok } from "../../utils/apiResponse";
import { bookingsService } from "./bookings.service";

export const bookingsController = {
  async create(req: Request, res: Response) {
    const booking = await bookingsService.create(req.user!.id, req.body);
    return res.status(201).json(ok(booking));
  },

  async getById(req: Request, res: Response) {
    const bookingId = String(req.params.id);
    const booking = await bookingsService.getById(req.user!, bookingId);
    if (!booking) return res.status(404).json(fail("NOT_FOUND", "Booking not found"));
    return res.status(200).json(ok(booking));
  },

  async myBookings(req: Request, res: Response) {
    const result = await bookingsService.listMine(req.user!, req.query as Record<string, unknown>);
    return res.status(200).json(ok(result.data, undefined, result.meta));
  },

  async approve(req: Request, res: Response) {
    const bookingId = String(req.params.id);
    const booking = await bookingsService.approve(req.user!.agencyId!, bookingId);
    if (!booking) return res.status(404).json(fail("NOT_FOUND", "Booking not found"));
    return res.status(200).json(ok(booking));
  },

  async reject(req: Request, res: Response) {
    const bookingId = String(req.params.id);
    const booking = await bookingsService.reject(req.user!.agencyId!, bookingId, req.body.reason);
    if (!booking) return res.status(404).json(fail("NOT_FOUND", "Booking not found"));
    return res.status(200).json(ok(booking));
  },

  async cancel(req: Request, res: Response) {
    const bookingId = String(req.params.id);
    const booking = await bookingsService.cancel(req.user!.id, bookingId, req.body.reason);
    if (!booking) return res.status(404).json(fail("NOT_FOUND", "Booking not found"));
    return res.status(200).json(ok(booking));
  },

  async complete(req: Request, res: Response) {
    const bookingId = String(req.params.id);
    const booking = await bookingsService.complete(req.user!.agencyId!, bookingId);
    if (!booking) return res.status(404).json(fail("NOT_FOUND", "Booking not found"));
    return res.status(200).json(ok(booking));
  }
};
