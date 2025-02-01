import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().nonempty(),
  description: z.string().optional(),
  parent: z.string().optional(),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
  meta_keywords: z.array(z.string()).optional(),
  is_featured: z.boolean(),
  feature_in_banner: z.boolean(),
});
