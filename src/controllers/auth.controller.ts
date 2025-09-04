import { Request, Response } from "express";
import { TRegister } from "../validators/auth.validator";
import UserModel from "../models/user.model";
import { IAuthRequest } from "../types/auth.type";
import authService from "../services/auth.service";

export default {
  async register(req: Request, res: Response) {
    try {
      const user = await authService.registerUser(req.body as TRegister);

      res.status(200).json({
        message: "Registrasi Berhasil",
        data: user,
      });
    } catch (error) {
      const err = error as Error;
      res.status(400).json({
        message: err.message,
        data: null,
      });
    }
  },

  async login(req: Request, res: Response) {
    try {
      const token = await authService.loginUser(req.body);

      res.status(200).json({
        message: "Login Berhasil",
        data: token,
      });
    } catch (error) {
      const err = error as Error;
      res.status(400).json({
        message: err.message,
        data: null,
      });
    }
  },

  async me(req: IAuthRequest, res: Response) {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Gagal mengidentifikasi pengguna dari token" });
    }

    const userProfile = await UserModel.findById(userId).select("-password");
    if (!userProfile) {
      return res.status(404).json({ message: "Pengguna tidak ditemukan" });
    }

    res.status(200).json({
      message: "Data profil berhasil diambil",
      data: userProfile,
    });
  },

  async verifyByOtp(req: Request, res: Response) {
    try {
      const { otpCode } = req.body;

      await authService.verifyUserOtp(otpCode);

      res.status(200).json({
        message: "Akun Anda berhasil diaktifkan. Silakan login.",
      });
    } catch (error) {
      const err = error as unknown as Error;
      res.status(400).json({
        message: err.message,
        data: null,
      });
    }
  },
};
