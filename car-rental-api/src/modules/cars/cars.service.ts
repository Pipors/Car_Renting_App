import { BookingStatus, Prisma } from "@prisma/client";
import { prisma } from "../../config/database";
import { makeMeta } from "../../utils/pagination";

const overlapWhere = (pickupDate: Date, returnDate: Date) => ({
  OR: [
    {
      pickupDate: { lte: returnDate },
      returnDate: { gte: pickupDate }
    }
  ],
  status: { in: [BookingStatus.APPROVED, BookingStatus.ACTIVE] }
});

export const carsService = {
  async list(query: Record<string, unknown>) {
    const page = Math.max(Number(query.page ?? 1), 1);
    const limit = Math.min(Math.max(Number(query.limit ?? 20), 1), 50);
    const skip = (page - 1) * limit;

    const where: Prisma.CarWhereInput = {
      isDeleted: false,
      isAvailable: true,
      agency: { isApproved: true }
    };

    if (query.city) where.city = String(query.city);
    if (query.type) where.type = String(query.type);
    if (query.transmission) where.transmission = String(query.transmission);
    if (query.seats) where.seats = Number(query.seats);
    if (query.minPrice || query.maxPrice) {
      where.pricePerDay = {
        gte: query.minPrice ? Number(query.minPrice) : undefined,
        lte: query.maxPrice ? Number(query.maxPrice) : undefined
      } as any;
    }

    if (query.pickupDate && query.returnDate) {
      const pickupDate = new Date(String(query.pickupDate));
      const returnDate = new Date(String(query.returnDate));

      where.bookings = {
        none: overlapWhere(pickupDate, returnDate)
      };
      where.availability = {
        none: {
          startDate: { lte: returnDate },
          endDate: { gte: pickupDate }
        }
      };
    }

    const [total, cars] = await Promise.all([
      prisma.car.count({ where }),
      prisma.car.findMany({
        where,
        include: {
          agency: {
            select: { id: true, name: true, avgRating: true, city: true }
          },
          photos: {
            where: { isPrimary: true },
            take: 1
          }
        },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" }
      })
    ]);

    return {
      data: cars.map((c) => ({
        ...c,
        primaryPhoto: c.photos[0]?.url ?? null
      })),
      meta: makeMeta(total, page, limit)
    };
  },

  async byId(id: string) {
    return prisma.car.findFirst({
      where: { id, isDeleted: false, isAvailable: true, agency: { isApproved: true } },
      include: {
        photos: true,
        agency: {
          select: {
            id: true,
            name: true,
            avgRating: true,
            totalReviews: true,
            city: true,
            logoUrl: true
          }
        },
        availability: {
          select: { startDate: true, endDate: true }
        }
      }
    });
  },

  async byAgency(agencyId: string, query: Record<string, unknown>) {
    const page = Math.max(Number(query.page ?? 1), 1);
    const limit = Math.min(Math.max(Number(query.limit ?? 20), 1), 50);
    const skip = (page - 1) * limit;

    const where: Prisma.CarWhereInput = {
      agencyId,
      isDeleted: false
    };

    if (query.type) where.type = String(query.type);
    if (query.available !== undefined) where.isAvailable = String(query.available) === "true";

    const [total, data] = await Promise.all([
      prisma.car.count({ where }),
      prisma.car.findMany({ where, include: { photos: true }, skip, take: limit, orderBy: { createdAt: "desc" } })
    ]);

    return { data, meta: makeMeta(total, page, limit) };
  },

  async create(agencyId: string, input: any) {
    return prisma.car.create({
      data: {
        agencyId,
        ...input,
        pricePerDay: new Prisma.Decimal(input.pricePerDay),
        depositAmount: new Prisma.Decimal(input.depositAmount)
      }
    });
  },

  async update(agencyId: string, id: string, input: any) {
    const existing = await prisma.car.findUnique({ where: { id } });
    if (!existing || existing.agencyId !== agencyId) return null;

    const hasActiveBooking = await prisma.booking.count({
      where: {
        carId: id,
        status: BookingStatus.ACTIVE
      }
    });

    if (hasActiveBooking > 0) {
      throw new Error("Cannot update a car with active bookings");
    }

    return prisma.car.update({
      where: { id },
      data: {
        ...input,
        ...(input.pricePerDay ? { pricePerDay: new Prisma.Decimal(input.pricePerDay) } : {}),
        ...(input.depositAmount ? { depositAmount: new Prisma.Decimal(input.depositAmount) } : {})
      }
    });
  },

  async remove(agencyId: string, id: string) {
    const existing = await prisma.car.findUnique({ where: { id } });
    if (!existing || existing.agencyId !== agencyId) return null;

    const hasOpenBooking = await prisma.booking.count({
      where: {
        carId: id,
        status: { in: [BookingStatus.PENDING, BookingStatus.APPROVED, BookingStatus.ACTIVE] }
      }
    });

    if (hasOpenBooking > 0) {
      throw new Error("Cannot delete car with active or pending bookings");
    }

    await prisma.car.update({
      where: { id },
      data: { isDeleted: true }
    });

    return true;
  }
};
