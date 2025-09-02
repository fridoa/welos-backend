import * as Yup from "yup";

export const registerSchema = Yup.object({
  fullName: Yup.string().required("Full name is required").min(3, "Full name must be at least 3 characters"),
  username: Yup.string().required("Username is required").min(3, "Username must be at least 3 characters"),
  email: Yup.string().required("Email is required").email("Email is invalid"),
  password: Yup.string().required("Password is required").min(6, "Password must be at least 6 characters"),
  confirmPassword: Yup.string()
    .required("Confirm password is required")
    .oneOf([Yup.ref("password")], "Passwords must match"),
});

export type TRegister = Yup.InferType<typeof registerSchema>;
