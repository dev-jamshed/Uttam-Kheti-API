import express from "express";
import multer from "multer";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../../controllers/admin/product.controller.js";
import validate from "../../middlewares/validation/validation.middleware.js";
import { createProductSchema } from "../../validations/product/create.validation.js";
import { updateProductSchema } from "../../validations/product/update.validation.js";

const router = express.Router();

const upload = multer();

router.post("/", upload.fields([{ name: 'mainImage', maxCount: 1 }, { name: 'additionalImages', maxCount: 10 }]), validate(createProductSchema), createProduct);
router.get("/", getProducts);
router.get("/:id", getProductById);
router.put("/:id", upload.fields([{ name: 'mainImage', maxCount: 1 }, { name: 'additionalImages', maxCount: 10 }]), validate(updateProductSchema), updateProduct);
router.delete("/:id", deleteProduct);

export default router;
