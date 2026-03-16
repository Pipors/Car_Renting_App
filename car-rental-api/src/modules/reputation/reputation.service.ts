import { prisma } from "../../config/database";
import { makeMeta } from "../../utils/pagination";

const normalizeTag = (tag: string) => tag.replace(/-/g, "_");

export const reputationService = {
  async rateRenter(agencyId: string, input: { bookingId: string; rating: number; tags: string[]; comment?: string }) {
    const booking = await prisma.booking.findUnique({ where: { id: input.bookingId } });
    if (!booking || booking.agencyId !== agencyId || booking.status !== "COMPLETED") {
      throw new Error("Booking is not eligible for renter rating");
    }

    const rating = await prisma.renterRating.create({
      data: {
        bookingId: booking.id,
        renterId: booking.renterId,
        agencyId,
        rating: input.rating,
        tags: input.tags,
        comment: input.comment
      }
    });

    const allRatings = await prisma.renterRating.findMany({ where: { renterId: booking.renterId } });
    const totalRatings = allRatings.length;
    const avgScore = totalRatings > 0 ? allRatings.reduce((s, r) => s + r.rating, 0) / totalRatings : 0;

    const counters = {
      onTimeCount: 0,
      cleanReturnCount: 0,
      minorDamageCount: 0,
      majorDamageCount: 0,
      noShowCount: 0
    };

    for (const item of allRatings) {
      for (const tag of item.tags) {
        const key = `${normalizeTag(tag)}Count` as keyof typeof counters;
        if (key in counters) counters[key] += 1;
      }
    }

    const reputation = await prisma.renterReputation.upsert({
      where: { renterId: booking.renterId },
      create: { renterId: booking.renterId, totalRatings, avgScore, ...counters },
      update: { totalRatings, avgScore, ...counters }
    });

    return { rating, reputation };
  },

  async getRenterReputation(renterId: string) {
    const renter = await prisma.user.findUnique({ where: { id: renterId } });
    if (!renter) return null;

    const reputation = await prisma.renterReputation.findUnique({ where: { renterId } });
    const recentRatings = await prisma.renterRating.findMany({
      where: { renterId },
      include: { agency: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      take: 5
    });

    return {
      renterId,
      renterName: `${renter.firstName} ${renter.lastName.charAt(0)}.`,
      profilePhoto: renter.profilePhoto,
      reputation: {
        avgScore: reputation?.avgScore ?? 0,
        totalRatings: reputation?.totalRatings ?? 0,
        tags: {
          on_time: reputation?.onTimeCount ?? 0,
          clean_return: reputation?.cleanReturnCount ?? 0,
          minor_damage: reputation?.minorDamageCount ?? 0,
          major_damage: reputation?.majorDamageCount ?? 0,
          no_show: reputation?.noShowCount ?? 0,
          late_return: 0
        }
      },
      recentRatings: recentRatings.map((r) => ({
        rating: r.rating,
        tags: r.tags,
        comment: r.comment,
        agencyName: r.agency.name,
        createdAt: r.createdAt
      }))
    };
  },

  async getRenterRatings(renterId: string, query: Record<string, unknown>) {
    const page = Math.max(Number(query.page ?? 1), 1);
    const limit = Math.min(Math.max(Number(query.limit ?? 20), 1), 50);
    const skip = (page - 1) * limit;

    const [total, rows] = await Promise.all([
      prisma.renterRating.count({ where: { renterId } }),
      prisma.renterRating.findMany({
        where: { renterId },
        include: { agency: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit
      })
    ]);

    return { data: rows, meta: makeMeta(total, page, limit) };
  },

  async dispute(renterId: string, ratingId: string, reason: string) {
    const rating = await prisma.renterRating.findUnique({ where: { id: ratingId } });
    if (!rating || rating.renterId !== renterId) throw new Error("Rating not found");

    const createdAt = new Date(rating.createdAt).getTime();
    const now = Date.now();
    const maxWindowMs = 30 * 24 * 60 * 60 * 1000;
    if (now - createdAt > maxWindowMs) {
      throw new Error("Dispute window expired");
    }

    return prisma.renterDispute.create({
      data: {
        ratingId,
        renterId,
        reason
      }
    });
  }
};
