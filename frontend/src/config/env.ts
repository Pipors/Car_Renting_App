import { z } from "zod";

const envSchema = z.object({
  VITE_API_BASE_URL: z.string().url().default("http://localhost:3000/api/v1"),
  VITE_STRIPE_PUBLISHABLE_KEY: z.string().default("pk_test_replace_me")
});

export const env = envSchema.parse(import.meta.env);
