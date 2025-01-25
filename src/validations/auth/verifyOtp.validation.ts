import z from "zod";

export const verifyOtpValidation = z.object({
  email: z.string().email(),
  otp: z.string().length(6),
});
