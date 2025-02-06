import { z } from "zod";

export const updateProductTypeSchema = z.object({
  name: z.string().nonempty("Name is required"),
});
