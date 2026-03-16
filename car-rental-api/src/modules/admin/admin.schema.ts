import { z } from "zod";

export const banUserSchema = z.object({
  banned: z.boolean(),
  reason: z.string().optional()
});

export const approveAgencySchema = z.object({
  approved: z.boolean()
});

export const resolveDisputeSchema = z.object({
  resolution: z.enum(["RESOLVED", "DISMISSED"]),
  adminNotes: z.string().optional(),
  removeRating: z.boolean().default(false)
});
