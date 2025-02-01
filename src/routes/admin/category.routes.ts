import express from "express";
import multerMiddleware from "../../middlewares/upload/multer.middleware.js";
import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../../controllers/admin/category.controller.js";
import validate from "../../middlewares/validation/validation.middleware.js";
import { createCategorySchema } from "../../validations/category/create.validation.js";
import { updateCategorySchema } from "../../validations/category/update.validation.js";

const router = express.Router();

router.post("/", multerMiddleware.single("image"), validate(createCategorySchema), createCategory);
router.get("/", getCategories);
router.get("/:id", getCategoryById);
router.put("/:id", multerMiddleware.single("image"), validate(updateCategorySchema), updateCategory);
router.delete("/:id", deleteCategory);

export default router;
