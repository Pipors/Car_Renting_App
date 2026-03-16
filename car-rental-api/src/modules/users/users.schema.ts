import { z } from "zod";

export const updateMeSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  phone: z.string().min(3).optional()
});

export const verifyPhoneSchema = z.object({
  otp: z.string().length(6)
});
