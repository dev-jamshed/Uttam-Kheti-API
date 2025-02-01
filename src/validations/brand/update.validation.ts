import { z } from "zod";

export const updateBrandSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
});
