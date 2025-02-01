import { z } from "zod";

export const updateCategorySchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  parent: z.string().optional(),
  image: z.string().optional(),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
  meta_keywords: z.array(z.string()).optional(),
  is_featured: z.boolean().optional(),
  feature_in_banner: z.boolean().optional(),
});