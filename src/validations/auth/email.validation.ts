import z from "zod";

export const emailValidation = z.object({
  email: z.string().email(),
});
