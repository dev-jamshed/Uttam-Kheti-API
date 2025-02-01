import { z } from "zod";

export const createBrandSchema = z.object({
  name: z.string().nonempty(),
  description: z.string().optional(),
});
