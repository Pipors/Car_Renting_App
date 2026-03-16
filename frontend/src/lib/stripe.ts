import { loadStripe } from "@stripe/stripe-js";
import { env } from "@/config/env";

export const stripePromise = loadStripe(env.VITE_STRIPE_PUBLISHABLE_KEY);
