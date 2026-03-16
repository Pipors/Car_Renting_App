import { z } from "zod";

const baseRegister = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().optional(),
  userType: z.enum(["RENTER", "AGENCY"]),
  agencyName: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  licenseNumber: z.string().optional()
});

export const registerSchema = baseRegister.superRefine((val, ctx) => {
  if (val.userType === "AGENCY") {
    const fields: Array<keyof typeof val> = ["agencyName", "address", "city", "country", "licenseNumber"];
    for (const field of fields) {
      if (!val[field]) {
        ctx.addIssue({ code: "custom", path: [field], message: `${field} is required for agency accounts` });
      }
    }
  }
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export const refreshSchema = z.object({});

export const forgotPasswordSchema = z.object({
  email: z.string().email()
});

export const resetPasswordSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6),
  newPassword: z.string().min(8)
});
