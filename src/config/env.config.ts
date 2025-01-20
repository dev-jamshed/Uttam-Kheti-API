import dotenv from "dotenv";
dotenv.config();

export const MONGO_URI: string | undefined = process.env.MONGO_URI;
export const DB_NAME: string | undefined = process.env.DB_NAME;
export const CLOUDINARY_CLOUD_NAME: string | undefined = process.env.CLOUDINARY_CLOUD_NAME;
export const CLOUDINARY_API_KEY: string | undefined = process.env.CLOUDINARY_API_KEY;
export const CLOUDINARY_API_SECRET: string | undefined = process.env.CLOUDINARY_API_SECRET;
export const PORT: number = parseInt(process.env.PORT || "3000", 10);
export const NODE_ENV: string | undefined = process.env.NODE_ENV;
export const SALTROUNDS: number = parseInt(process.env.SALTROUNDS || "10", 10);
export const JWT_SECRET: string | undefined = process.env.JWT_SECRET;
export const JWT_EXPIRES_IN: string | undefined = process.env.JWT_EXPIRES_IN;
export const OTP_EXPIRES_IN: string | undefined = process.env.OTP_EXPIRES_IN;

export const SMTP_USERNAME: string | undefined = process.env.SMTP_USERNAME;
export const SMTP_PASSWORD: string | undefined = process.env.SMTP_PASSWORD;
export const SMTP_HOST: string | undefined = process.env.SMTP_HOST;
export const SMTP_PORT: number = parseInt(process.env.SMTP_PORT || "587", 10);