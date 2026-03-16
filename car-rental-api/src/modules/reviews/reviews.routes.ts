import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { requireRole } from "../../middlewares/role.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { createAgencyReviewSchema } from "./reviews.schema";
import { reviewsController } from "./reviews.controller";

const router = Router();

router.post("/reviews/agency", authMiddleware, requireRole("RENTER"), validate(createAgencyReviewSchema), reviewsController.createAgencyReview);
router.get("/agencies/:agencyId/reviews", reviewsController.byAgency);
router.get("/reviews/:id", reviewsController.byId);
router.delete("/reviews/:id", authMiddleware, requireRole("ADMIN"), reviewsController.remove);

export { router as reviewsRoutes };
