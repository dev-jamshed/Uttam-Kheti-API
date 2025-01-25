import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { SMTP_USERNAME, SMTP_PASSWORD } from "../../config/env.config.js";
import ApiError from "./ApiError.util.js";
import { STATUS_CODES } from "../../constants/global/statusCodes.constants.js";
import { OTP_EMAIL_SEND_ERROR } from "../../constants/global/message.constants.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: SMTP_USERNAME,
    pass: SMTP_PASSWORD,
  },
});

interface EmailOptions {
  to: string;
  subject: string;
  template: string;
  context: { [key: string]: string };
}

export const sendEmail = async (options: EmailOptions): Promise<void> => {
  const templatePath = path.join(__dirname, "../../templates", `${options.template}.html`);
  console.log(templatePath);
  let html = fs.readFileSync(templatePath, "utf8");
  // Replace placeholders with actual values
  for (const [key, value] of Object.entries(options.context)) {
    const regex = new RegExp(`{{${key}}}`, "g");
    html = html.replace(regex, value);
  }

  const mailOptions = {
    from: SMTP_USERNAME,
    to: options.to,
    subject: options.subject,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw new ApiError(STATUS_CODES.EMAIL_NOT_SENT, OTP_EMAIL_SEND_ERROR);
  }
};
