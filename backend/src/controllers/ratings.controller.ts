import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import { redis } from "../services/redis.service";

const prisma = new PrismaClient();

const RatingSchema = z.object({
  bookingId: z.string(),
  score: z.number().int().min(1).max(5),
  // max 500 characters for the review comment
  comment: z.string().max(500).optional(),
});

const REPUTATION_CACHE_TTL = 60; // seconds

export async function rateRenter(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const data = RatingSchema.parse(req.body);

    const agency = await prisma.agency.findUnique({
      where: { userId: req.user!.userId },
    });
    if (!agency) {
      res.status(403).json({ message: "Agency profile not found" });
      return;
    }

    const booking = await prisma.booking.findUnique({
      where: { id: data.bookingId },
      include: { renter: true, rating: true },
    });
    if (!booking) {
      res.status(404).json({ message: "Booking not found" });
      return;
    }
    if (booking.agencyId !== agency.id) {
      res.status(403).json({ message: "Forbidden" });
      return;
    }
    if (booking.status !== "COMPLETED") {
      res
        .status(400)
        .json({ message: "Can only rate renters for completed bookings" });
      return;
    }
    if (booking.rating) {
      res.status(409).json({ message: "This booking has already been rated" });
      return;
    }

    const rating = await prisma.renterRating.create({
      data: {
        bookingId: data.bookingId,
        renterId: booking.renterId,
        agencyId: agency.id,
        score: data.score,
        comment: data.comment,
      },
    });

    // Recalculate and persist renter reputation
    const allRatings = await prisma.renterRating.findMany({
      where: { renterId: booking.renterId },
      select: { score: true },
    });
    const avg =
      allRatings.reduce((sum, r) => sum + r.score, 0) / allRatings.length;

    await prisma.renter.update({
      where: { id: booking.renterId },
      data: {
        reputationScore: Math.round(avg * 100) / 100,
        ratingCount: allRatings.length,
      },
    });

    // Bust cache
    await redis.del(`reputation:${booking.renterId}`);

    res.status(201).json(rating);
  } catch (err) {
    next(err);
  }
}

export async function getRenterReputation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { renterId } = req.params;
    const cacheKey = `reputation:${renterId}`;

    const cached = await redis.get(cacheKey);
    if (cached) {
      res.json(JSON.parse(cached));
      return;
    }

    const renter = await prisma.renter.findUnique({
      where: { id: renterId },
      include: {
        user: { select: { name: true } },
        ratingsReceived: {
          include: {
            agency: { select: { companyName: true } },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!renter) {
      res.status(404).json({ message: "Renter not found" });
      return;
    }

    const result = {
      renterId: renter.id,
      name: renter.user.name,
      reputationScore: renter.reputationScore,
      ratingCount: renter.ratingCount,
      ratings: renter.ratingsReceived,
    };

    await redis.setex(cacheKey, REPUTATION_CACHE_TTL, JSON.stringify(result));
    res.json(result);
  } catch (err) {
    next(err);
  }
}
