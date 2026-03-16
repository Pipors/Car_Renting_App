import "express-async-errors";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env";
import { errorMiddleware } from "./middlewares/error.middleware";
import { adminRoutes } from "./modules/admin/admin.routes";
import { authRoutes } from "./modules/auth/auth.routes";
import { bookingsRoutes } from "./modules/bookings/bookings.routes";
import { carsRoutes } from "./modules/cars/cars.routes";
import { paymentsRoutes } from "./modules/payments/payments.routes";
import { reputationRoutes } from "./modules/reputation/reputation.routes";
import { reviewsRoutes } from "./modules/reviews/reviews.routes";
import { usersRoutes } from "./modules/users/users.routes";

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get(`/api/${env.API_VERSION}/health`, (_req, res) => {
  res.status(200).json({
    success: true,
    data: {
      status: "ok",
      timestamp: new Date().toISOString()
    }
  });
});

app.use(`/api/${env.API_VERSION}/auth`, authRoutes);
app.use(`/api/${env.API_VERSION}/users`, usersRoutes);
app.use(`/api/${env.API_VERSION}/cars`, carsRoutes);
app.use(`/api/${env.API_VERSION}/bookings`, bookingsRoutes);
app.use(`/api/${env.API_VERSION}`, paymentsRoutes);
app.use(`/api/${env.API_VERSION}`, reviewsRoutes);
app.use(`/api/${env.API_VERSION}`, reputationRoutes);
app.use(`/api/${env.API_VERSION}`, adminRoutes);

app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: "NOT_FOUND",
      message: "Route not found"
    }
  });
});

app.use(errorMiddleware);

export { app };
