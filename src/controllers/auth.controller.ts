import { Request, Response } from "express";
import { TLogin, TRegister } from "../validators/auth.validator";
import UserModel from "../models/user.model";
import { generateToken } from "../utils/jwt";

export default {
  async register(req: Request, res: Response) {
    const { fullName, username, email, password } = req.body as TRegister;

    try {
      const existingUsername = await UserModel.findOne({ username });
      if (existingUsername) {
        return res.status(400).json({
          message: "Username already exists",
          data: null,
        });
      }

      const existingEmail = await UserModel.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({
          message: "Email already exists",
          data: null,
        });
      }

      const user = new UserModel({ fullName, username, email, password });
      await user.save();

      res.status(200).json({
        message: "User registered successfully",
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
    const { identifier, password } = req.body as TLogin;

    try {
      const user = await UserModel.findOne({
        $or: [
          {
            username: identifier,
          },
          {
            email: identifier,
          },
        ],
      });

      if (!user) {
        return res.status(401).json({
          message: "Invalid Credentials",
          data: null,
        });
      }

      const isPasswordCorrect = await user.comparePassword(password);
      if (!isPasswordCorrect) {
        return res.status(401).json({
          message: "Invalid Credentials",
          data: null,
        });
      }

      const token = generateToken({
        id: user._id,
        role: user.role,
      });

      res.status(200).json({
        message: "User login successfully",
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
};
