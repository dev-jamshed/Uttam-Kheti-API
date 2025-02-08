import express from "express";
import multerMiddleware from "../../middlewares/upload/multer.middleware.js";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductsByIds,
} from "../../controllers/admin/product.controller.js";
import validate from "../../middlewares/validation/validation.middleware.js";
import { createProductSchema } from "../../validations/product/create.validation.js";
import { updateProductSchema } from "../../validations/product/update.validation.js";
import { getProductsByIdsSchema } from "../../validations/product/getByIds.validation.js";
import { verifyAdmin } from "../../middlewares/admin/verifyAdmin.middleware.js";

const router = express.Router();

router.get("/by-ids", validate(getProductsByIdsSchema), getProductsByIds); // New route for getting products by multiple IDs
router.post("/", verifyAdmin, multerMiddleware.single("mainImage"), validate(createProductSchema), createProduct);
router.get("/", getProducts);
router.get("/:id", getProductById);
router.put("/:id", verifyAdmin, multerMiddleware.single("mainImage"), validate(updateProductSchema), updateProduct);
router.delete("/:id", verifyAdmin, deleteProduct);

export default router;
