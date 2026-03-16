import { Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { fail } from "../utils/apiResponse";

export const errorMiddleware = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof ZodError) {
    return res.status(400).json(fail("VALIDATION_ERROR", "Validation failed", err.issues));
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
    return res.status(409).json(fail("CONFLICT", "Resource already exists"));
  }

  const message = err instanceof Error ? err.message : "Internal server error";
  return res.status(500).json(fail("INTERNAL_SERVER_ERROR", message));
};
