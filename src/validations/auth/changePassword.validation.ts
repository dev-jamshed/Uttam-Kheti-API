import z from "zod";

export const changePasswordValidation = z.object({
  password: z.string().min(8),
  newPassword: z.string().min(8),
});
