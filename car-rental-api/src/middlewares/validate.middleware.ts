import { NextFunction, Request, Response } from "express";
import { ZodTypeAny } from "zod";
import { fail } from "../utils/apiResponse";

export const validate = (schema: ZodTypeAny) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json(fail("VALIDATION_ERROR", "Invalid request body", parsed.error.issues));
    }

    req.body = parsed.data;
    return next();
  };
};
