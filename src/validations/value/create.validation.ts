import { z } from "zod";

export const createValueSchema = z.object({
  attribute_id: z.string().nonempty("Attribute ID is required"),
  name: z.string().nonempty("Name is required"),
});
