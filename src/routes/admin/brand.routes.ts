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
import { verifyAdmin } from "../../middlewares/admin/verifyAdmin.middleware.js";

const router = express.Router();

router.post("/",verifyAdmin, multerMiddleware.single("image"), validate(createBrandSchema), createBrand);
router.get("/", getBrands);
router.get("/:id", getBrandById);
router.put("/:id", verifyAdmin,multerMiddleware.single("image"), validate(updateBrandSchema), updateBrand);
router.delete("/:id", verifyAdmin,deleteBrand);

export default router;
