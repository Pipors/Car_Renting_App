import { z } from "zod";

export const rateRenterSchema = z.object({
  bookingId: z.string().uuid(),
  rating: z.coerce.number().int().min(1).max(5),
  tags: z.array(z.string()).default([]),
  comment: z.string().optional()
});

export const disputeSchema = z.object({
  reason: z.string().min(1)
});
