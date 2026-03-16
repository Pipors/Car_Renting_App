import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { requireRole } from "../../middlewares/role.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { paymentsController } from "./payments.controller";
import { confirmPaymentSchema, deductPaymentSchema, paymentIntentSchema, releasePaymentSchema } from "./payments.schema";

const router = Router();

router.post("/webhooks/stripe", paymentsController.webhook);

router.use(authMiddleware);
router.post("/payments/intent", requireRole("RENTER"), validate(paymentIntentSchema), paymentsController.createIntent);
router.post("/payments/confirm", requireRole("RENTER"), validate(confirmPaymentSchema), paymentsController.confirm);
router.post("/payments/:id/release", requireRole("AGENCY"), validate(releasePaymentSchema), paymentsController.release);
router.post("/payments/:id/deduct", requireRole("AGENCY"), validate(deductPaymentSchema), paymentsController.deduct);
router.get("/payments/me", paymentsController.listMine);

export { router as paymentsRoutes };
