import { Request, Response } from "express";
import { fail, ok } from "../../utils/apiResponse";
import { carsService } from "./cars.service";

export const carsController = {
  async list(req: Request, res: Response) {
    const result = await carsService.list(req.query as Record<string, unknown>);
    return res.status(200).json(ok(result.data, undefined, result.meta));
  },

  async byId(req: Request, res: Response) {
    const carId = String(req.params.id);
    const car = await carsService.byId(carId);
    if (!car) {
      return res.status(404).json(fail("NOT_FOUND", "Car not found"));
    }

    return res.status(200).json(ok({
      ...car,
      blockedDates: car.availability.flatMap((a) => [a.startDate.toISOString().slice(0, 10), a.endDate.toISOString().slice(0, 10)])
    }));
  },

  async byAgency(req: Request, res: Response) {
    const agencyId = String(req.params.agencyId);
    const result = await carsService.byAgency(agencyId, req.query as Record<string, unknown>);
    return res.status(200).json(ok(result.data, undefined, result.meta));
  },

  async create(req: Request, res: Response) {
    const agencyId = req.user?.agencyId;
    if (!agencyId) return res.status(403).json(fail("FORBIDDEN", "Agency account required"));

    const created = await carsService.create(agencyId, req.body);
    return res.status(201).json(ok(created));
  },

  async update(req: Request, res: Response) {
    const agencyId = req.user?.agencyId;
    if (!agencyId) return res.status(403).json(fail("FORBIDDEN", "Agency account required"));

    const carId = String(req.params.id);
    const updated = await carsService.update(agencyId, carId, req.body);
    if (!updated) return res.status(404).json(fail("NOT_FOUND", "Car not found"));
    return res.status(200).json(ok(updated));
  },

  async remove(req: Request, res: Response) {
    const agencyId = req.user?.agencyId;
    if (!agencyId) return res.status(403).json(fail("FORBIDDEN", "Agency account required"));

    const carId = String(req.params.id);
    const deleted = await carsService.remove(agencyId, carId);
    if (!deleted) return res.status(404).json(fail("NOT_FOUND", "Car not found"));
    return res.status(204).send();
  }
};
