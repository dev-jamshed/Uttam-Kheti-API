import { z } from "zod";

export const createAttributeSchema = z.object({
  productType: z.string().nonempty("Product Type is required"),
  name: z.string().nonempty("Name is required"),
});
