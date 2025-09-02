import dotenv from "dotenv";

dotenv.config();

export const env = {
  DATABASE_URL: process.env.DATABASE_URL || "",

  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY || "",

  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "",
};
