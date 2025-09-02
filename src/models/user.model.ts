import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";

export interface User {
  fullName: string;
  username: string;
  email: string;
  password: string;
  role: string;
  profilePicture: string;
  isActive: boolean;
  otpCode: string;
  createdAt?: string;
  comparePassword(password: string): Promise<boolean>;
}

const UserSchema = new Schema<User>(
  {
    fullName: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    profilePicture: {
      type: String,
      default: "user.png",
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    otpCode: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    try {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    } catch (error) {
      return next(error as Error);
    }
  }
  next();
});

UserSchema.methods.comparePassword = async function (passwordInput: string): Promise<boolean> {
  return await bcrypt.compare(passwordInput, this.password);
};

UserSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

const UserModel = mongoose.model<User>("User", UserSchema);

export default UserModel;
