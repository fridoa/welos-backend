import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import { verifyPassword } from "../utils/password";
import { IUser } from "../types/user.type";

const UserSchema = new Schema<IUser>(
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
    otpCodeExpires: {
      type: Date,
    }
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

UserSchema.methods.comparePassword = function (passwordInput: string): Promise<boolean> {
  return verifyPassword(passwordInput, this.password);
};

UserSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

const UserModel = mongoose.model<IUser>("User", UserSchema);

export default UserModel;
