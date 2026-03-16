import { z } from "zod";

export const createCarSchema = z.object({
  make: z.string().min(1),
  model: z.string().min(1),
  year: z.coerce.number().int().min(1950),
  type: z.string().min(1),
  transmission: z.string().min(1),
  fuelType: z.string().min(1),
  seats: z.coerce.number().int().positive(),
  pricePerDay: z.coerce.number().positive(),
  depositAmount: z.coerce.number().nonnegative(),
  description: z.string().optional(),
  features: z.array(z.string()).default([]),
  city: z.string().min(1),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional()
});

export const updateCarSchema = createCarSchema.partial();
