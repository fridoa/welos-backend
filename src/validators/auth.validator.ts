import * as Yup from "yup";

export const registerSchema = Yup.object({
  fullName: Yup.string().required("Full name wajib diisi").min(3, "Full name minimal 3 karakter"),
  username: Yup.string().required("Username wajib diisi").min(3, "Username minimal 3 karakter"),
  email: Yup.string().required("Email wajib diisi").email("Email wajib diisi"),
  password: Yup.string().required("Password wajib diisi").min(6, "Password minimal 6 karakter"),
  confirmPassword: Yup.string()
    .required("Confirm password wajib diisi")
    .oneOf([Yup.ref("password")], "Konfirmasi password tidak sesuai"),
});

export const loginSchema = Yup.object({
  identifier: Yup.string().required("Username atau email wajib diisi"),
  password: Yup.string().required("Password wajib diisi"),
});

export const verifyOtpSchema = Yup.object({
  otpCode: Yup.string().required("Kode OTP wajib diisi").length(6, "Kode OTP harus 6 karakter"),
});

export type TRegister = Yup.InferType<typeof registerSchema>;
export type TLogin = Yup.InferType<typeof loginSchema>;
export type TVerifyOtp = Yup.InferType<typeof verifyOtpSchema>;
