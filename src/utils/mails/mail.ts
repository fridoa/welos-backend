import nodemailer from "nodemailer";
import ejs from "ejs";
import path from "path";
import { env } from "../env";
import { ISendMail } from "../../types/mail.type";

const transporter = nodemailer.createTransport({
  service: env.EMAIL_SMTP_SERVICE_NAME,
  host: env.EMAIL_SMTP_HOST,
  port: env.EMAIL_SMTP_PORT,
  secure: env.EMAIL_SMTP_SECURE,
  auth: {
    user: env.EMAIL_SMTP_USER,
    pass: env.EMAIL_SMTP_PASS,
  },
  requireTLS: true,
});

export const sendMail = async (option: ISendMail) => {
  return await transporter.sendMail({
    from: `"Welos Support" <${env.EMAIL_SMTP_USER}>`,
    ...option,
  });
};

export const renderMail = async (template: string, data: any): Promise<string> => {
  const content = path.join(__dirname, `./templates/${template}`);
  return await ejs.renderFile(content, data);
};

export async function sendActivationOtpEmail(to: string, username: string, otp: string) {
  const emailHtml = await renderMail("activation-otp.ejs", {
    username,
    otpCode: otp,
  });

  await sendMail({
    to,
    subject: "Kode Aktivasi Akun Anda",
    html: emailHtml,
  });
}
