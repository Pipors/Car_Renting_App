import { BookingStatus, Prisma } from "@prisma/client";
import { prisma } from "../../config/database";
import { makeMeta } from "../../utils/pagination";

const requireApprovedAgency = process.env.NODE_ENV === "production";

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
      ...(requireApprovedAgency ? { agency: { isApproved: true } } : {})
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
      where: {
        id,
        isDeleted: false,
        isAvailable: true,
        ...(requireApprovedAgency ? { agency: { isApproved: true } } : {})
      },
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
      prisma.car.findMany({
        where,
        include: {
          photos: true,
          bookings: {
            where: {
              status: { in: [BookingStatus.APPROVED, BookingStatus.ACTIVE] },
              returnDate: { gte: new Date() }
            },
            select: { id: true },
            take: 1
          }
        },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" }
      })
    ]);

    return {
      data: data.map((car) => {
        const currentlyRented = car.bookings.length > 0;
        return {
          ...car,
          currentlyRented,
          rentalStatus: currentlyRented ? "RENTED" : "AVAILABLE"
        };
      }),
      meta: makeMeta(total, page, limit)
    };
  },

  async create(agencyId: string, input: any) {
    const { photoUrls = [], ...payload } = input;

    const created = await prisma.car.create({
      data: {
        agencyId,
        ...payload,
        pricePerDay: new Prisma.Decimal(payload.pricePerDay),
        depositAmount: new Prisma.Decimal(payload.depositAmount)
      }
    });

    if (Array.isArray(photoUrls) && photoUrls.length > 0) {
      await prisma.carPhoto.createMany({
        data: photoUrls.map((url: string, index: number) => ({
          carId: created.id,
          url,
          isPrimary: index === 0,
          order: index
        }))
      });
    }

    return prisma.car.findUnique({ where: { id: created.id }, include: { photos: true } });
  },

  async update(agencyId: string, id: string, input: any) {
    const existing = await prisma.car.findUnique({ where: { id } });
    if (!existing || existing.agencyId !== agencyId) return null;

    const { photoUrls = [], ...payload } = input;

    const hasActiveBooking = await prisma.booking.count({
      where: {
        carId: id,
        status: BookingStatus.ACTIVE
      }
    });

    if (hasActiveBooking > 0) {
      throw new Error("Cannot update a car with active bookings");
    }

    const updated = await prisma.car.update({
      where: { id },
      data: {
        ...payload,
        ...(payload.pricePerDay ? { pricePerDay: new Prisma.Decimal(payload.pricePerDay) } : {}),
        ...(payload.depositAmount ? { depositAmount: new Prisma.Decimal(payload.depositAmount) } : {})
      }
    });

    if (Array.isArray(photoUrls) && photoUrls.length > 0) {
      const existingPhotoCount = await prisma.carPhoto.count({ where: { carId: id } });
      await prisma.carPhoto.createMany({
        data: photoUrls.map((url: string, index: number) => ({
          carId: id,
          url,
          isPrimary: existingPhotoCount === 0 && index === 0,
          order: existingPhotoCount + index
        }))
      });
    }

    return prisma.car.findUnique({ where: { id: updated.id }, include: { photos: true } });
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
