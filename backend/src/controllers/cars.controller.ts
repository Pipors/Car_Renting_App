import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const CarSchema = z.object({
  make: z.string().min(1),
  model: z.string().min(1),
  year: z.number().int().min(1900).max(new Date().getFullYear() + 1),
  pricePerDay: z.number().positive(),
  depositAmount: z.number().positive(),
  description: z.string().optional(),
  imageUrl: z.string().url().optional(),
});

export async function listCars(req: Request, res: Response, next: NextFunction) {
  try {
    const { make, model, minPrice, maxPrice, available } = req.query;
    const cars = await prisma.car.findMany({
      where: {
        ...(make ? { make: { contains: String(make), mode: "insensitive" } } : {}),
        ...(model ? { model: { contains: String(model), mode: "insensitive" } } : {}),
        ...(minPrice ? { pricePerDay: { gte: Number(minPrice) } } : {}),
        ...(maxPrice ? { pricePerDay: { lte: Number(maxPrice) } } : {}),
        ...(available !== undefined ? { available: available === "true" } : {}),
      },
      include: {
        agency: { select: { companyName: true, id: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(cars);
  } catch (err) {
    next(err);
  }
}

export async function getCar(req: Request, res: Response, next: NextFunction) {
  try {
    const car = await prisma.car.findUnique({
      where: { id: req.params.id },
      include: { agency: { select: { companyName: true, id: true } } },
    });
    if (!car) {
      res.status(404).json({ message: "Car not found" });
      return;
    }
    res.json(car);
  } catch (err) {
    next(err);
  }
}

export async function createCar(req: Request, res: Response, next: NextFunction) {
  try {
    const data = CarSchema.parse(req.body);
    const agency = await prisma.agency.findUnique({
      where: { userId: req.user!.userId },
    });
    if (!agency) {
      res.status(403).json({ message: "Agency profile not found" });
      return;
    }
    const car = await prisma.car.create({
      data: { ...data, agencyId: agency.id },
    });
    res.status(201).json(car);
  } catch (err) {
    next(err);
  }
}

export async function updateCar(req: Request, res: Response, next: NextFunction) {
  try {
    const data = CarSchema.partial().parse(req.body);
    const car = await prisma.car.findUnique({ where: { id: req.params.id } });
    if (!car) {
      res.status(404).json({ message: "Car not found" });
      return;
    }
    const agency = await prisma.agency.findUnique({
      where: { userId: req.user!.userId },
    });
    if (!agency || car.agencyId !== agency.id) {
      res.status(403).json({ message: "Forbidden" });
      return;
    }
    const updated = await prisma.car.update({
      where: { id: req.params.id },
      data,
    });
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

export async function deleteCar(req: Request, res: Response, next: NextFunction) {
  try {
    const car = await prisma.car.findUnique({ where: { id: req.params.id } });
    if (!car) {
      res.status(404).json({ message: "Car not found" });
      return;
    }
    const agency = await prisma.agency.findUnique({
      where: { userId: req.user!.userId },
    });
    if (!agency || car.agencyId !== agency.id) {
      res.status(403).json({ message: "Forbidden" });
      return;
    }
    await prisma.car.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
