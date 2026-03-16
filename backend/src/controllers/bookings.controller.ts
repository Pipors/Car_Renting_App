import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import { createPaymentIntent } from "../services/stripe.service";

const prisma = new PrismaClient();

const CreateBookingSchema = z.object({
  carId: z.string(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
});

const UpdateStatusSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED", "ACTIVE", "COMPLETED", "CANCELLED"]),
});

export async function createBooking(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const data = CreateBookingSchema.parse(req.body);
    const renter = await prisma.renter.findUnique({
      where: { userId: req.user!.userId },
    });
    if (!renter) {
      res.status(403).json({ message: "Renter profile not found" });
      return;
    }

    const car = await prisma.car.findUnique({ where: { id: data.carId } });
    if (!car || !car.available) {
      res.status(400).json({ message: "Car not available" });
      return;
    }

    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    if (end <= start) {
      res.status(400).json({ message: "endDate must be after startDate" });
      return;
    }
    const days = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );
    const totalPrice = days * car.pricePerDay;

    const booking = await prisma.booking.create({
      data: {
        carId: car.id,
        renterId: renter.id,
        agencyId: car.agencyId,
        startDate: start,
        endDate: end,
        totalPrice,
        depositAmount: car.depositAmount,
      },
    });
    res.status(201).json(booking);
  } catch (err) {
    next(err);
  }
}

export async function listBookings(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { userId, role } = req.user!;
    let bookings;

    if (role === "AGENCY") {
      const agency = await prisma.agency.findUnique({ where: { userId } });
      bookings = await prisma.booking.findMany({
        where: { agencyId: agency!.id },
        include: {
          car: true,
          renter: { include: { user: { select: { name: true, email: true } } } },
        },
        orderBy: { createdAt: "desc" },
      });
    } else {
      const renter = await prisma.renter.findUnique({ where: { userId } });
      bookings = await prisma.booking.findMany({
        where: { renterId: renter!.id },
        include: {
          car: true,
          agency: { select: { companyName: true } },
        },
        orderBy: { createdAt: "desc" },
      });
    }

    res.json(bookings);
  } catch (err) {
    next(err);
  }
}

export async function getBooking(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: req.params.id },
      include: {
        car: true,
        renter: {
          include: {
            user: { select: { name: true, email: true } },
          },
        },
        agency: { select: { companyName: true } },
        rating: true,
      },
    });
    if (!booking) {
      res.status(404).json({ message: "Booking not found" });
      return;
    }
    res.json(booking);
  } catch (err) {
    next(err);
  }
}

export async function updateBookingStatus(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { status } = UpdateStatusSchema.parse(req.body);
    const booking = await prisma.booking.findUnique({
      where: { id: req.params.id },
    });
    if (!booking) {
      res.status(404).json({ message: "Booking not found" });
      return;
    }

    const agency = await prisma.agency.findUnique({
      where: { userId: req.user!.userId },
    });
    if (!agency || booking.agencyId !== agency.id) {
      res.status(403).json({ message: "Forbidden" });
      return;
    }

    const updated = await prisma.booking.update({
      where: { id: req.params.id },
      data: { status },
    });
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

export async function payDeposit(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: req.params.id },
      include: { renter: true },
    });
    if (!booking) {
      res.status(404).json({ message: "Booking not found" });
      return;
    }
    if (booking.renter.userId !== req.user!.userId) {
      res.status(403).json({ message: "Forbidden" });
      return;
    }
    if (booking.depositPaid) {
      res.status(400).json({ message: "Deposit already paid" });
      return;
    }

    const paymentIntent = await createPaymentIntent(
      booking.depositAmount,
      "usd",
      { bookingId: booking.id }
    );

    await prisma.booking.update({
      where: { id: booking.id },
      data: { stripePaymentIntentId: paymentIntent.id },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    next(err);
  }
}
