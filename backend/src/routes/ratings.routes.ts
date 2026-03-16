import { Router } from "express";
import {
  rateRenter,
  getRenterReputation,
} from "../controllers/ratings.controller";
import { authenticate, requireRole } from "../middleware/auth.middleware";

const router = Router();

router.post("/", authenticate, requireRole("AGENCY"), rateRenter);
// Agencies can view any renter's reputation; renters can view their own
router.get(
  "/renter/:renterId",
  authenticate,
  getRenterReputation
);

export default router;
