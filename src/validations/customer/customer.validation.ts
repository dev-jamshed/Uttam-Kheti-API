import z from "zod";

export const customerValidation = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  phone: z.string().min(10),
  address: z.string(),
  password: z.string().min(8),
});
