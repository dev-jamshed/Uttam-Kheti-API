
import { z } from "zod";

export const getProductsByIdsSchema = z.object({
  ids: z.array(z.string().nonempty("ID is required")).nonempty("IDs array cannot be empty"),
});