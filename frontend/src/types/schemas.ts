import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters")
});

export const registerRenterSchema = z
  .object({
    email: z.string().email(),
    password: z
      .string()
      .min(8)
      .regex(/[A-Z]/, "Must contain uppercase")
      .regex(/[0-9]/, "Must contain number"),
    confirmPassword: z.string(),
    firstName: z.string().min(2).max(50),
    lastName: z.string().min(2).max(50),
    phone: z.string().regex(/^\+?[0-9]{8,15}$/, "Invalid phone number")
  })
  .extend({
    userType: z.literal("RENTER")
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
  });

export const registerAgencySchema = z
  .object({
    email: z.string().email(),
    password: z
      .string()
      .min(8)
      .regex(/[A-Z]/, "Must contain uppercase")
      .regex(/[0-9]/, "Must contain number"),
    confirmPassword: z.string(),
    firstName: z.string().min(2).max(50),
    lastName: z.string().min(2).max(50),
    phone: z.string().regex(/^\+?[0-9]{8,15}$/, "Invalid phone number"),
    userType: z.literal("AGENCY"),
    agencyName: z.string().min(2).max(100),
    address: z.string().min(5),
    city: z.string().min(2),
    country: z.string().min(2),
    licenseNumber: z.string().min(3)
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
  });

export const createCarSchema = z.object({
  make: z.string().min(2),
  model: z.string().min(1),
  year: z.coerce.number().int().min(1990).max(new Date().getFullYear() + 1),
  type: z.string(),
  transmission: z.string(),
  fuelType: z.string(),
  seats: z.coerce.number().int().min(2).max(12),
  pricePerDay: z.coerce.number().positive(),
  depositAmount: z.coerce.number().positive(),
  description: z.string().max(1000).optional(),
  city: z.string().min(2),
  features: z.array(z.string()).optional()
});
