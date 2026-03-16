import { PaymentStatus, Prisma } from "@prisma/client";
import { prisma } from "../../config/database";
import { makeMeta } from "../../utils/pagination";

export const paymentsService = {
  async createIntent(renterId: string, bookingId: string) {
    const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking || booking.renterId !== renterId) throw new Error("Booking not found");

    const paymentIntentId = `pi_${booking.id.replace(/-/g, "").slice(0, 20)}_retry`;
    const payment = await prisma.payment.upsert({
      where: { bookingId },
      create: {
        bookingId,
        renterId,
        stripePaymentIntentId: paymentIntentId,
        amount: booking.totalAmount,
        depositAmount: booking.depositAmount,
        status: PaymentStatus.PENDING
      },
      update: {
        stripePaymentIntentId: paymentIntentId,
        status: PaymentStatus.PENDING
      }
    });

    return {
      clientSecret: `${paymentIntentId}_secret_mock`,
      paymentIntentId,
      amount: Number(payment.depositAmount),
      currency: payment.currency
    };
  },

  async confirm(renterId: string, bookingId: string, paymentIntentId: string) {
    const payment = await prisma.payment.findUnique({ where: { bookingId } });
    if (!payment || payment.renterId !== renterId) throw new Error("Payment not found");
    if (payment.stripePaymentIntentId !== paymentIntentId) throw new Error("PaymentIntent mismatch");

    return prisma.payment.update({
      where: { id: payment.id },
      data: { status: PaymentStatus.HELD }
    });
  },

  async release(agencyId: string, bookingId: string) {
    const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking || booking.agencyId !== agencyId) throw new Error("Booking not found");

    return prisma.payment.update({
      where: { bookingId },
      data: { status: PaymentStatus.RELEASED }
    });
  },

  async deduct(agencyId: string, bookingId: string, deductAmount: number, reason: string) {
    const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking || booking.agencyId !== agencyId) throw new Error("Booking not found");

    const payment = await prisma.payment.findUnique({ where: { bookingId } });
    if (!payment) throw new Error("Payment not found");

    const deducted = new Prisma.Decimal(deductAmount);

    return prisma.payment.update({
      where: { bookingId },
      data: {
        status: PaymentStatus.PARTIALLY_DEDUCTED,
        deductedAmount: deducted,
        deductionReason: reason,
        refundedAt: new Date()
      }
    });
  },

  async listMine(user: { id: string; userType: string; agencyId?: string }, query: Record<string, unknown>) {
    const page = Math.max(Number(query.page ?? 1), 1);
    const limit = Math.min(Math.max(Number(query.limit ?? 20), 1), 50);
    const skip = (page - 1) * limit;

    const where: any = {};
    if (user.userType === "RENTER") {
      where.renterId = user.id;
    } else if (user.userType === "AGENCY") {
      where.booking = { agencyId: user.agencyId };
    }

    const [total, rows] = await Promise.all([
      prisma.payment.count({ where }),
      prisma.payment.findMany({
        where,
        include: {
          booking: {
            include: {
              car: true
            }
          }
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit
      })
    ]);

    return { data: rows, meta: makeMeta(total, page, limit) };
  },

  async stripeWebhook(eventType: string, paymentIntentId: string) {
    if (eventType === "payment_intent.succeeded") {
      await prisma.payment.updateMany({
        where: { stripePaymentIntentId: paymentIntentId },
        data: { status: PaymentStatus.CAPTURED, capturedAt: new Date() }
      });
      return;
    }

    if (eventType === "payment_intent.payment_failed") {
      const payment = await prisma.payment.findFirst({ where: { stripePaymentIntentId: paymentIntentId } });
      if (payment) {
        await prisma.payment.update({ where: { id: payment.id }, data: { status: PaymentStatus.PENDING } });
        await prisma.booking.update({ where: { id: payment.bookingId }, data: { status: "REJECTED" } });
      }
      return;
    }

    if (eventType === "charge.refunded") {
      await prisma.payment.updateMany({
        where: { stripePaymentIntentId: paymentIntentId },
        data: { status: PaymentStatus.REFUNDED, refundedAt: new Date() }
      });
    }
  }
};
