import express from "express";
import multerMiddleware from "../../middlewares/upload/multer.middleware.js";
import {
  createBrand,
  getBrands,
  getBrandById,
  updateBrand,
  deleteBrand,
} from "../../controllers/admin/brand.controller.js";
import validate from "../../middlewares/validation/validation.middleware.js";
import { createBrandSchema } from "../../validations/brand/create.validation.js";
import { updateBrandSchema } from "../../validations/brand/update.validation.js";

const router = express.Router();

router.post("/", multerMiddleware.single("image"), validate(createBrandSchema), createBrand);
router.get("/", getBrands);
router.get("/:id", getBrandById);
router.put("/:id", multerMiddleware.single("image"), validate(updateBrandSchema), updateBrand);
router.delete("/:id", deleteBrand);

export default router;
