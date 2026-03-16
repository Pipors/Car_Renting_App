import { z } from "zod";

export const createBookingSchema = z.object({
  carId: z.string().uuid(),
  pickupDate: z.string(),
  returnDate: z.string(),
  notes: z.string().optional()
});

export const rejectBookingSchema = z.object({
  reason: z.string().min(1)
});

export const cancelBookingSchema = z.object({
  reason: z.string().min(1)
});
