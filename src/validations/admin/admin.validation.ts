import z from "zod";
import Admin from "../../models/admin/admin.model.js";

export const adminValidation = z.object({
  name: z.string().min(3),
  email: z
    .string()
    .email()
    .refine(
      async (email) => {
        const existingAdmin = await Admin.findOne({ email });
        return !existingAdmin;
      },
      {
        message: "Email already exists",
      }
    ),
  phone: z.string().min(10),
  password: z.string().min(8),
});
