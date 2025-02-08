
import { z } from "zod";

export const addToWishlistSchema = z.object({
  product_id: z.string().nonempty("Product ID is required"),
});