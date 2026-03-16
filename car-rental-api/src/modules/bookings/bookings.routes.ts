import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { requireRole } from "../../middlewares/role.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { bookingsController } from "./bookings.controller";
import { cancelBookingSchema, createBookingSchema, rejectBookingSchema } from "./bookings.schema";

const router = Router();

router.use(authMiddleware);

router.post("/", requireRole("RENTER"), validate(createBookingSchema), bookingsController.create);
router.get("/me", bookingsController.myBookings);
router.get("/agencies/me/bookings", requireRole("AGENCY"), bookingsController.myBookings);
router.get("/:id", bookingsController.getById);
router.post("/:id/approve", requireRole("AGENCY"), bookingsController.approve);
router.post("/:id/reject", requireRole("AGENCY"), validate(rejectBookingSchema), bookingsController.reject);
router.post("/:id/cancel", requireRole("RENTER"), validate(cancelBookingSchema), bookingsController.cancel);
router.post("/:id/complete", requireRole("AGENCY"), bookingsController.complete);

export { router as bookingsRoutes };
