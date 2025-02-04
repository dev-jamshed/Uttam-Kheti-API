import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().nonempty(),
  description: z.string().optional(),
  category: z.string().nonempty(),
  brand: z.string().optional(),
  attributes: z.array(z.object({
    weight: z.number().positive(),
    price: z.number().positive(),
  })).optional(),
});
