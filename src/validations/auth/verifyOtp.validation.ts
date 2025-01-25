import z from "zod";

export const verifyOtpValidation = z.object({
  email: z.string().email(),
  otp: z.string().min(6).max(6),
});
