import { Router } from "express";
import { handleWebhook } from "../controllers/payments.controller";

const router = Router();

// Raw body required for Stripe signature verification
router.post(
  "/webhook",
  handleWebhook
);

export default router;
