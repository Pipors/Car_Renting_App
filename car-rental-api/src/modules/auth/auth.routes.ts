import { Router } from "express";
import { rateLimit } from "../../middlewares/rateLimit.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { authController } from "./auth.controller";
import { forgotPasswordSchema, loginSchema, registerSchema, resetPasswordSchema } from "./auth.schema";

const router = Router();

router.post("/register", rateLimit("auth", 10, 60), validate(registerSchema), authController.register);
router.post("/login", rateLimit("auth", 10, 60), validate(loginSchema), authController.login);
router.post("/refresh", authController.refresh);
router.post("/logout", authController.logout);
router.post("/forgot-password", rateLimit("forgot-password", 3, 60 * 60), validate(forgotPasswordSchema), authController.forgotPassword);
router.post("/reset-password", validate(resetPasswordSchema), authController.resetPassword);

export { router as authRoutes };
