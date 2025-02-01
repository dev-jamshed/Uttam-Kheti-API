import z from "zod";

export const adminValidation = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  phone: z.string().min(10),
  password: z.string().min(8),
});
