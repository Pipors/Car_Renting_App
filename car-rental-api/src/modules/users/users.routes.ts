import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { usersController } from "./users.controller";
import { updateMeSchema, verifyPhoneSchema } from "./users.schema";

const router = Router();

router.use(authMiddleware);
router.get("/me", usersController.getMe);
router.put("/me", validate(updateMeSchema), usersController.updateMe);
router.post("/me/send-phone-otp", usersController.sendPhoneOtp);
router.post("/me/verify-phone", validate(verifyPhoneSchema), usersController.verifyPhone);

export { router as usersRoutes };
