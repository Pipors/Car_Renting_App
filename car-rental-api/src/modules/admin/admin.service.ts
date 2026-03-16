import { prisma } from "../../config/database";
import { makeMeta } from "../../utils/pagination";

const paged = (query: Record<string, unknown>) => {
  const page = Math.max(Number(query.page ?? 1), 1);
  const limit = Math.min(Math.max(Number(query.limit ?? 20), 1), 50);
  return { page, limit, skip: (page - 1) * limit };
};

export const adminService = {
  async users(query: Record<string, unknown>) {
    const { page, limit, skip } = paged(query);
    const where: any = {};
    if (query.userType) where.userType = String(query.userType);
    if (query.isBanned !== undefined) where.isBanned = String(query.isBanned) === "true";
    if (query.isVerified !== undefined) where.isVerified = String(query.isVerified) === "true";
    if (query.search) {
      where.OR = [
        { email: { contains: String(query.search), mode: "insensitive" } },
        { firstName: { contains: String(query.search), mode: "insensitive" } },
        { lastName: { contains: String(query.search), mode: "insensitive" } }
      ];
    }

    const [total, rows] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({ where, include: { agency: true }, skip, take: limit, orderBy: { createdAt: "desc" } })
    ]);

    return { data: rows, meta: makeMeta(total, page, limit) };
  },

  async banUser(id: string, banned: boolean, reason?: string) {
    const user = await prisma.user.update({ where: { id }, data: { isBanned: banned, banReason: reason } });
    if (banned) {
      await prisma.refreshToken.deleteMany({ where: { userId: id } });
    }
    return user;
  },

  async agencies(query: Record<string, unknown>) {
    const { page, limit, skip } = paged(query);
    const where: any = {};
    if (query.isApproved !== undefined) where.isApproved = String(query.isApproved) === "true";
    if (query.search) where.name = { contains: String(query.search), mode: "insensitive" };

    const [total, rows] = await Promise.all([
      prisma.agency.count({ where }),
      prisma.agency.findMany({ where, include: { user: true }, skip, take: limit, orderBy: { createdAt: "desc" } })
    ]);

    return { data: rows, meta: makeMeta(total, page, limit) };
  },

  async approveAgency(id: string, approved: boolean) {
    return prisma.agency.update({ where: { id }, data: { isApproved: approved } });
  },

  async bookings(query: Record<string, unknown>) {
    const { page, limit, skip } = paged(query);
    const where: any = {};
    if (query.status) where.status = String(query.status);
    if (query.agencyId) where.agencyId = String(query.agencyId);
    if (query.renterId) where.renterId = String(query.renterId);

    const [total, rows] = await Promise.all([
      prisma.booking.count({ where }),
      prisma.booking.findMany({
        where,
        include: { car: true, renter: true, agency: true, payment: true },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" }
      })
    ]);

    return { data: rows, meta: makeMeta(total, page, limit) };
  },

  async disputes(query: Record<string, unknown>) {
    const { page, limit, skip } = paged(query);
    const where: any = {};
    if (query.status) where.status = String(query.status);

    const [total, rows] = await Promise.all([
      prisma.renterDispute.count({ where }),
      prisma.renterDispute.findMany({ where, skip, take: limit, orderBy: { createdAt: "desc" } })
    ]);

    return { data: rows, meta: makeMeta(total, page, limit) };
  },

  async resolveDispute(id: string, input: { resolution: "RESOLVED" | "DISMISSED"; adminNotes?: string; removeRating: boolean }) {
    const dispute = await prisma.renterDispute.update({
      where: { id },
      data: {
        status: input.resolution,
        adminNotes: input.adminNotes,
        resolvedAt: new Date()
      }
    });

    if (input.removeRating) {
      const rating = await prisma.renterRating.findUnique({ where: { id: dispute.ratingId } });
      if (rating) {
        await prisma.renterRating.delete({ where: { id: rating.id } });
      }
    }

    return dispute;
  }
};
