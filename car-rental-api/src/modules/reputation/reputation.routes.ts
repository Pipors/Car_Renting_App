import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { requireRole } from "../../middlewares/role.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { reputationController } from "./reputation.controller";
import { disputeSchema, rateRenterSchema } from "./reputation.schema";

const router = Router();

router.use(authMiddleware);
router.post("/reputation/rate-renter", requireRole("AGENCY"), validate(rateRenterSchema), reputationController.rateRenter);
router.get("/reputation/renters/:renterId", requireRole("AGENCY"), reputationController.getRenter);
router.get("/reputation/me", requireRole("RENTER"), reputationController.getMine);
router.get("/reputation/renters/:renterId/ratings", requireRole("AGENCY"), reputationController.getRenterRatings);
router.post("/reputation/dispute/:ratingId", requireRole("RENTER"), validate(disputeSchema), reputationController.dispute);

export { router as reputationRoutes };
