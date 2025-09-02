import { NextFunction, Request, Response } from "express";
import { registerSchema } from "../validators/auth.validator";

const validateRegister = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await registerSchema.validate(req.body, { abortEarly: false });

    next();
  } catch (error) {
    const err = error as Error;
    res.status(400).json({
      message: "Validation error",
      errors: err.message,
    });
  }
};

export default {
  validateRegister,
};
