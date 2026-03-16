import { z } from "zod";

export const paymentIntentSchema = z.object({
  bookingId: z.string().uuid()
});

export const confirmPaymentSchema = z.object({
  bookingId: z.string().uuid(),
  paymentIntentId: z.string().min(1)
});

export const releasePaymentSchema = z.object({
  bookingId: z.string().uuid()
});

export const deductPaymentSchema = z.object({
  bookingId: z.string().uuid(),
  deductAmount: z.coerce.number().positive(),
  reason: z.string().min(1)
});
