import { z } from "zod";

export const updateProductSchema = z.object({
  name: z.string().nonempty("Name is required"),
  description: z.string().optional(),
  category: z.string().nonempty("Category is required"),
  brand: z.string().optional(),
  price: z.number().positive("Price must be a positive number"),
  crossPrice: z.number().positive("Cross Price must be a positive number").optional(),
});
