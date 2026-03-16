import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { requireRole } from "../../middlewares/role.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { adminController } from "./admin.controller";
import { approveAgencySchema, banUserSchema, resolveDisputeSchema } from "./admin.schema";

const router = Router();

router.use(authMiddleware, requireRole("ADMIN"));

router.get("/admin/users", adminController.users);
router.patch("/admin/users/:id/ban", validate(banUserSchema), adminController.banUser);
router.get("/admin/agencies", adminController.agencies);
router.patch("/admin/agencies/:id/approve", validate(approveAgencySchema), adminController.approveAgency);
router.get("/admin/bookings", adminController.bookings);
router.get("/admin/disputes", adminController.disputes);
router.patch("/admin/disputes/:id/resolve", validate(resolveDisputeSchema), adminController.resolveDispute);
router.delete("/admin/reviews/:id", adminController.removeReview);

export { router as adminRoutes };
