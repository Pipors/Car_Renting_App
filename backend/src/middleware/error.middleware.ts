import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof ZodError) {
    res.status(422).json({
      message: "Validation error",
      errors: err.flatten().fieldErrors,
    });
    return;
  }

  if (err instanceof Error) {
    console.error(err.stack);
    res.status(500).json({ message: err.message });
    return;
  }

  res.status(500).json({ message: "Internal server error" });
}
