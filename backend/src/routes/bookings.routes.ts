import { Router } from "express";
import {
  createBooking,
  listBookings,
  getBooking,
  updateBookingStatus,
  payDeposit,
} from "../controllers/bookings.controller";
import { authenticate, requireRole } from "../middleware/auth.middleware";

const router = Router();

router.use(authenticate);

router.post("/", requireRole("RENTER"), createBooking);
router.get("/", listBookings);
router.get("/:id", getBooking);
router.patch("/:id/status", requireRole("AGENCY"), updateBookingStatus);
router.post("/:id/pay", requireRole("RENTER"), payDeposit);

export default router;
