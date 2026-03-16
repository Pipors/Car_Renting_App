import { prisma } from "../../config/database";
import { makeMeta } from "../../utils/pagination";

const maskLastName = (lastName: string) => `${lastName.charAt(0)}.`;

export const reviewsService = {
  async create(renterId: string, input: { bookingId: string; rating: number; comment: string }) {
    const booking = await prisma.booking.findUnique({ where: { id: input.bookingId } });
    if (!booking || booking.renterId !== renterId || booking.status !== "COMPLETED") {
      throw new Error("Booking is not eligible for review");
    }

    const review = await prisma.agencyReview.create({
      data: {
        bookingId: input.bookingId,
        agencyId: booking.agencyId,
        reviewerId: renterId,
        rating: input.rating,
        comment: input.comment
      }
    });

    const agencyReviews = await prisma.agencyReview.findMany({
      where: { agencyId: booking.agencyId, isVisible: true },
      select: { rating: true }
    });

    const totalReviews = agencyReviews.length;
    const avgRating = totalReviews > 0 ? agencyReviews.reduce((s, r) => s + r.rating, 0) / totalReviews : 0;

    await prisma.agency.update({
      where: { id: booking.agencyId },
      data: { avgRating, totalReviews }
    });

    return review;
  },

  async byAgency(agencyId: string, query: Record<string, unknown>) {
    const page = Math.max(Number(query.page ?? 1), 1);
    const limit = Math.min(Math.max(Number(query.limit ?? 20), 1), 50);
    const skip = (page - 1) * limit;

    const [total, rows] = await Promise.all([
      prisma.agencyReview.count({ where: { agencyId, isVisible: true } }),
      prisma.agencyReview.findMany({
        where: { agencyId, isVisible: true },
        include: { reviewer: { select: { firstName: true, lastName: true, profilePhoto: true } } },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit
      })
    ]);

    return {
      data: rows.map((r) => ({
        ...r,
        reviewer: {
          firstName: r.reviewer.firstName,
          lastName: maskLastName(r.reviewer.lastName),
          profilePhoto: r.reviewer.profilePhoto
        }
      })),
      meta: makeMeta(total, page, limit)
    };
  },

  async byId(id: string) {
    return prisma.agencyReview.findUnique({
      where: { id },
      include: {
        reviewer: { select: { firstName: true, lastName: true, profilePhoto: true } },
        agency: { select: { id: true, name: true } }
      }
    });
  },

  async hide(reviewId: string) {
    const review = await prisma.agencyReview.update({
      where: { id: reviewId },
      data: { isVisible: false }
    });

    const agencyReviews = await prisma.agencyReview.findMany({
      where: { agencyId: review.agencyId, isVisible: true },
      select: { rating: true }
    });

    const totalReviews = agencyReviews.length;
    const avgRating = totalReviews > 0 ? agencyReviews.reduce((s, r) => s + r.rating, 0) / totalReviews : 0;

    await prisma.agency.update({
      where: { id: review.agencyId },
      data: { avgRating, totalReviews }
    });
  }
};
