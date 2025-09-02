import express from "express";
import authController from "../controllers/auth.controller";
import authMiddleware from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/register", authMiddleware.validateRegister, authController.register);
router.post("/login", authMiddleware.validateLogin, authController.login);

export default router;
