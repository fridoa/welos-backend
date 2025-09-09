import UserModel from "../models/user.model";
import { ITokenPayload } from "../types/auth.type";
import { generateToken } from "../utils/jwt";
import { sendActivationOtpEmail } from "../utils/mails/mail";
import { generateOtp } from "../utils/mails/otp";
import { verifyPassword } from "../utils/password";
import { TLogin, TRegister } from "../validators/auth.validator";
import createHttpError from "http-errors";

async function registerUser(user: TRegister) {
  const { email, username, fullName, password } = user;

  const existingUser = await UserModel.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    if (existingUser.email === email) {
      throw createHttpError(409, "Email ini sudah terdaftar.");
    }
    if (existingUser.username === username) {
      throw createHttpError(409, "Username ini sudah digunakan.");
    }
  }

  const newUser = new UserModel({ fullName, username, email, password });

  const otp = generateOtp();
  newUser.otpCode = otp;
  newUser.otpCodeExpires = new Date(Date.now() + 10 * 60 * 1000);
  await newUser.save();

  try {
    await sendActivationOtpEmail(newUser.email, newUser.username, otp);
  } catch (emailError) {
    console.error("Gagal mengirim email aktivasi:", emailError);
    throw createHttpError(500, "Pengguna berhasil dibuat, namun gagal mengirim email verifikasi.");
  }

  return newUser;
}

async function loginUser(userData: TLogin) {
  const { identifier, password } = userData;

  const user = await UserModel.findOne({
    $or: [{ email: identifier }, { username: identifier }],
  });

  if (!user || !(await verifyPassword(password, user.password))) {
    throw createHttpError(401, "Kredensial yang Anda masukkan tidak valid.");
  }

  if (!user.isActive) {
    throw createHttpError(403, "Akun Anda belum diaktifkan.");
  }

  const payload: ITokenPayload = { id: user._id, role: user.role };
  const token = generateToken(payload);

  return token;
}

async function verifyUserOtp(otpCode: string) {
  const user = await UserModel.findOne({
    otpCode: otpCode,
    otpCodeExpires: { $gt: new Date() },
  });

  if (!user) {
    throw createHttpError(400, "Kode OTP tidak valid atau telah kedaluwarsa.");
  }

  user.isActive = true;
  user.otpCode = null;
  user.otpCodeExpires = null;
  await user.save();
}

export default {
  registerUser,
  verifyUserOtp,
  loginUser,
};
