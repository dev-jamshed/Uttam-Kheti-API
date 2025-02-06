import { z } from "zod";

export const updateValueSchema = z.object({
  attribute_id: z.string().nonempty("Attribute ID is required"),
  name: z.string().nonempty("Name is required"),
});
