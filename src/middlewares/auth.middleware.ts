import { NextFunction, Request, Response } from "express";
import { loginSchema, registerSchema } from "../validators/auth.validator";
import { IAuthRequest } from "../types/auth.type";
import { getUserData } from "../utils/jwt";

const validateRegister = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await registerSchema.validate(req.body, { abortEarly: false });

    next();
  } catch (error) {
    const err = error as Error;
    res.status(400).json({
      message: err.message,
      data: null,
    });
  }
};

const validateLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await loginSchema.validate(req.body, { abortEarly: false });

    next();
  } catch (error) {
    const err = error as Error;
    res.status(400).json({
      message: err.message,
      data: null,
    });
  }
};

const validateMe = async (req: IAuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers?.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Access token required",
    });
  }

  const token = authHeader.substring(7);

  const userData = getUserData(token);

  if (!userData) {
    return res.status(401).json({
      message: "Invalid token payload",
    });
  }

  req.user = {
    id: userData.id,
    role: userData.role,
  };

  next();
};

export default {
  validateRegister,
  validateLogin,
  validateMe,
};
