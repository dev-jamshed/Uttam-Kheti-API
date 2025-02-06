import { z } from "zod";

export const createProductTypeSchema = z.object({
  name: z.string().nonempty("Name is required"),
});
