import dotenv from "dotenv";

dotenv.config();

export const env = {
  DATABASE_URL: process.env.DATABASE_URL || "",

  EMAIL_SMTP_HOST: process.env.EMAIL_SMTP_HOST || "",

  EMAIL_SMTP_PASS: process.env.EMAIL_SMTP_PASS || "",

  EMAIL_SMTP_PORT: Number(process.env.EMAIL_SMTP_PORT) || 465,

  EMAIL_SMTP_SECURE: Boolean(process.env.EMAIL_SMTP_SECURE) === false,

  EMAIL_SMTP_SERVICE_NAME: process.env.EMAIL_SMTP_SERVICE_NAME || "",

  EMAIL_SMTP_USER: process.env.EMAIL_SMTP_USER || "",

  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY || "",

  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "",
};
