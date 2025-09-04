export interface IUser {
  fullName: string;
  username: string;
  email: string;
  password: string;
  role: string;
  profilePicture: string;
  isActive: boolean;
  otpCode: string | null;
  otpCodeExpires: Date | null;
  createdAt: string;
}
