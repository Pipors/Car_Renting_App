import { Router } from "express";
import {
  listCars,
  getCar,
  createCar,
  updateCar,
  deleteCar,
} from "../controllers/cars.controller";
import { authenticate, requireRole } from "../middleware/auth.middleware";
import { uploadCarImage } from "../middleware/upload.middleware";

const router = Router();

router.get("/", listCars);
router.get("/:id", getCar);
router.post("/", authenticate, requireRole("AGENCY"), uploadCarImage, createCar);
router.put("/:id", authenticate, requireRole("AGENCY"), uploadCarImage, updateCar);
router.delete("/:id", authenticate, requireRole("AGENCY"), deleteCar);

export default router;
