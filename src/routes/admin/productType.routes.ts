import express from "express";
import {
  createProductType,
  getProductTypes,
  getProductTypeById,
  updateProductType,
  deleteProductType,
} from "../../controllers/admin/productType.controller.js";
import validate from "../../middlewares/validation/validation.middleware.js";
import { createProductTypeSchema } from "../../validations/productType/create.validation.js";
import { updateProductTypeSchema } from "../../validations/productType/update.validation.js";
import { verifyAdmin } from "../../middlewares/admin/verifyAdmin.middleware.js";

const router = express.Router();

router.post("/",verifyAdmin, validate(createProductTypeSchema), createProductType);
router.get("/", getProductTypes);
router.get("/:id", getProductTypeById);
router.put("/:id", verifyAdmin,validate(updateProductTypeSchema), updateProductType);
router.delete("/:id",verifyAdmin, deleteProductType);

export default router;
