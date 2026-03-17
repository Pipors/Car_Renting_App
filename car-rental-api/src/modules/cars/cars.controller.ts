import { Request, Response } from "express";
import { fail, ok } from "../../utils/apiResponse";
import { uploadFileToS3 } from "../../utils/s3";
import { carsService } from "./cars.service";

const buildPhotoUrls = async (agencyId: string, files: Array<{ originalname: string; buffer: Buffer }>) => {
  if (!files.length) return [] as string[];

  const uploaded = await Promise.all(
    files.map((file, index) =>
      uploadFileToS3(`cars/${agencyId}/${Date.now()}-${index}-${file.originalname}`, file.buffer)
    )
  );

  return uploaded.map((f) => f.url);
};

const getUploadedFiles = (req: Request) => {
  const requestWithFiles = req as Request & { files?: Array<{ originalname: string; buffer: Buffer }> };
  return requestWithFiles.files ?? [];
};

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

  async myAgency(req: Request, res: Response) {
    const agencyId = req.user?.agencyId;
    if (!agencyId) return res.status(403).json(fail("FORBIDDEN", "Agency account required"));

    const result = await carsService.byAgency(agencyId, req.query as Record<string, unknown>);
    return res.status(200).json(ok(result.data, undefined, result.meta));
  },

  async create(req: Request, res: Response) {
    const agencyId = req.user?.agencyId;
    if (!agencyId) return res.status(403).json(fail("FORBIDDEN", "Agency account required"));

    const files = getUploadedFiles(req);
    const photoUrls = await buildPhotoUrls(agencyId, files);
    const created = await carsService.create(agencyId, { ...req.body, photoUrls });
    return res.status(201).json(ok(created));
  },

  async update(req: Request, res: Response) {
    const agencyId = req.user?.agencyId;
    if (!agencyId) return res.status(403).json(fail("FORBIDDEN", "Agency account required"));

    const carId = String(req.params.id);
    const files = getUploadedFiles(req);
    const photoUrls = await buildPhotoUrls(agencyId, files);
    const updated = await carsService.update(agencyId, carId, { ...req.body, photoUrls });
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
