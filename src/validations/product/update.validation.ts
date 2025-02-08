import { z } from "zod";

export const updateProductSchema = z
  .object({
    name: z.string().nonempty("Name is required"),
    description: z.string().optional(),
    category: z.string().nonempty("Category is required"),
    brand: z.string().optional(),
    price: z.number().positive("Price must be a positive number"),
    crossPrice: z.number().positive("Cross Price must be a positive number").optional(),
    track_qty: z.boolean(),
    qty: z.number().positive("Quantity must be a positive number").optional(),
  })
  .refine(
    (data) => {
      // If track_qty is true, qty must be defined
      if (data.track_qty && data.qty === undefined) {
        return false;
      }
      return true;
    },
    {
      message: "Quantity is required when track_qty is true",
      path: ["qty"], // Associate the error with the `qty` field
    }
  );
