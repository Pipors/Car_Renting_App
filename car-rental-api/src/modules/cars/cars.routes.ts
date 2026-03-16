import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { requireRole } from "../../middlewares/role.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { carsController } from "./cars.controller";
import { createCarSchema, updateCarSchema } from "./cars.schema";

const router = Router();

router.get("/", carsController.list);
router.get("/agencies/:agencyId/cars", carsController.byAgency);
router.get("/:id", carsController.byId);

router.post("/", authMiddleware, requireRole("AGENCY"), validate(createCarSchema), carsController.create);
router.put("/:id", authMiddleware, requireRole("AGENCY"), validate(updateCarSchema), carsController.update);
router.delete("/:id", authMiddleware, requireRole("AGENCY"), carsController.remove);

export { router as carsRoutes };
