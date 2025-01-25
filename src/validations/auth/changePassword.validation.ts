import z from "zod";

export const changePasswordValidation = z.object({
  tempToken: z.string(),
  newPassword: z.string().min(8),
});
