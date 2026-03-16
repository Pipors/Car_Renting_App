import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { stripe } from "../services/stripe.service";

const prisma = new PrismaClient();

export async function handleWebhook(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const sig = req.headers["stripe-signature"] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    res.status(500).json({ message: "Webhook secret not configured" });
    return;
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body as Buffer, sig, webhookSecret);
  } catch (err) {
    res.status(400).json({ message: `Webhook error: ${(err as Error).message}` });
    return;
  }

  try {
    if (event.type === "payment_intent.succeeded") {
      const pi = event.data.object;
      const bookingId = pi.metadata?.bookingId;
      if (bookingId) {
        await prisma.booking.update({
          where: { id: bookingId },
          data: { depositPaid: true, status: "APPROVED" },
        });
      }
    }
    res.json({ received: true });
  } catch (err) {
    next(err);
  }
}
