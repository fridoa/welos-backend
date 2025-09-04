import express from "express";
import authController from "../controllers/auth.controller";
import authMiddleware from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/auth/register", authMiddleware.validateRegister, authController.register);
router.post("/auth/login", authMiddleware.validateLogin, authController.login);
router.post("/auth/verification", authMiddleware.validatVerifySchema, authController.verifyByOtp);
router.get("/auth/me", authMiddleware.validateMe, authController.me);

export default router;
