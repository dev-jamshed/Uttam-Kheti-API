import { z } from "zod";

export const updateProductSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  category: z.string().optional(),
  brand: z.string().optional(),
  attributes: z.array(z.object({
    weight: z.number().positive(),
    price: z.number().positive(),
  })).optional(),
});