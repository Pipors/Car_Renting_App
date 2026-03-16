import { BookingStatus, Prisma } from "@prisma/client";
import { prisma } from "../../config/database";
import { makeMeta } from "../../utils/pagination";

const daysBetween = (start: Date, end: Date) => {
  const ms = end.getTime() - start.getTime();
  return Math.max(Math.ceil(ms / (1000 * 60 * 60 * 24)), 1);
};

export const bookingsService = {
  async create(renterId: string, input: { carId: string; pickupDate: string; returnDate: string; notes?: string }) {
    const car = await prisma.car.findUnique({
      where: { id: input.carId },
      include: { agency: true }
    });

    if (!car || car.isDeleted || !car.isAvailable || !car.agency.isApproved) {
      throw new Error("Car not available for booking");
    }

    const pickupDate = new Date(input.pickupDate);
    const returnDate = new Date(input.returnDate);

    const overlap = await prisma.booking.count({
      where: {
        carId: input.carId,
        status: { in: [BookingStatus.APPROVED, BookingStatus.ACTIVE] },
        pickupDate: { lte: returnDate },
        returnDate: { gte: pickupDate }
      }
    });

    if (overlap > 0) {
      throw new Error("Booking dates overlap with existing reservation");
    }

    const totalDays = daysBetween(pickupDate, returnDate);
    const totalAmount = new Prisma.Decimal(car.pricePerDay).mul(totalDays);

    const booking = await prisma.booking.create({
      data: {
        carId: car.id,
        renterId,
        agencyId: car.agencyId,
        pickupDate,
        returnDate,
        totalDays,
        pricePerDay: car.pricePerDay,
        totalAmount,
        depositAmount: car.depositAmount,
        notes: input.notes
      }
    });

    const paymentIntentId = `pi_${booking.id.replace(/-/g, "").slice(0, 20)}`;

    await prisma.payment.create({
      data: {
        bookingId: booking.id,
        renterId,
        stripePaymentIntentId: paymentIntentId,
        amount: totalAmount,
        depositAmount: car.depositAmount,
        status: "HELD"
      }
    });

    return {
      ...booking,
      paymentIntent: {
        clientSecret: `${paymentIntentId}_secret_mock`
      }
    };
  },

  async getById(requester: { id: string; userType: string; agencyId?: string }, id: string) {
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        car: true,
        agency: true,
        renter: {
          select: { id: true, firstName: true, lastName: true, email: true }
        },
        payment: true
      }
    });

    if (!booking) return null;

    const allowed =
      requester.userType === "ADMIN" ||
      booking.renterId === requester.id ||
      booking.agencyId === requester.agencyId;

    return allowed ? booking : null;
  },

  async listMine(requester: { id: string; userType: string; agencyId?: string }, query: Record<string, unknown>) {
    const page = Math.max(Number(query.page ?? 1), 1);
    const limit = Math.min(Math.max(Number(query.limit ?? 20), 1), 50);
    const skip = (page - 1) * limit;
    const status = query.status ? String(query.status) : undefined;

    const where: any = {};
    if (status) where.status = status;

    if (requester.userType === "RENTER") where.renterId = requester.id;
    if (requester.userType === "AGENCY") where.agencyId = requester.agencyId;

    const [total, rows] = await Promise.all([
      prisma.booking.count({ where }),
      prisma.booking.findMany({
        where,
        include: { payment: true, car: true },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit
      })
    ]);

    return { data: rows, meta: makeMeta(total, page, limit) };
  },

  async approve(agencyId: string, bookingId: string) {
    const booking = await prisma.booking.findUnique({ where: { id: bookingId }, include: { payment: true } });
    if (!booking || booking.agencyId !== agencyId) return null;
    if (booking.status !== "PENDING") throw new Error("Only pending bookings can be approved");

    const updated = await prisma.booking.update({ where: { id: bookingId }, data: { status: "APPROVED" } });
    await prisma.carAvailability.create({
      data: {
        carId: booking.carId,
        startDate: booking.pickupDate,
        endDate: booking.returnDate,
        reason: "booked"
      }
    });

    return updated;
  },

  async reject(agencyId: string, bookingId: string, reason: string) {
    const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking || booking.agencyId !== agencyId) return null;
    if (booking.status !== "PENDING") throw new Error("Only pending bookings can be rejected");

    await prisma.payment.updateMany({
      where: { bookingId },
      data: { status: "REFUNDED", refundedAt: new Date() }
    });

    return prisma.booking.update({
      where: { id: bookingId },
      data: { status: "REJECTED", rejectionReason: reason }
    });
  },

  async cancel(renterId: string, bookingId: string, reason: string) {
    const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking || booking.renterId !== renterId) return null;
    if (!["PENDING", "APPROVED"].includes(booking.status)) throw new Error("Booking cannot be cancelled");

    await prisma.payment.updateMany({
      where: { bookingId },
      data: { status: "REFUNDED", refundedAt: new Date() }
    });

    if (booking.status === "APPROVED") {
      await prisma.carAvailability.deleteMany({
        where: {
          carId: booking.carId,
          startDate: booking.pickupDate,
          endDate: booking.returnDate,
          reason: "booked"
        }
      });
    }

    return prisma.booking.update({
      where: { id: bookingId },
      data: { status: "CANCELLED", cancellationReason: reason }
    });
  },

  async complete(agencyId: string, bookingId: string) {
    const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking || booking.agencyId !== agencyId) return null;
    if (booking.status !== "APPROVED") throw new Error("Only approved bookings can be completed");

    await prisma.payment.updateMany({
      where: { bookingId },
      data: { status: "CAPTURED", capturedAt: new Date() }
    });

    await prisma.car.update({
      where: { id: booking.carId },
      data: { totalBookings: { increment: 1 } }
    });

    return prisma.booking.update({
      where: { id: bookingId },
      data: { status: "COMPLETED" }
    });
  }
};
