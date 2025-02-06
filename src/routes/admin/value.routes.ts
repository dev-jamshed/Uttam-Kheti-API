import express from "express";
import {
  createValue,
  getValues,
  getValueById,
  updateValue,
  deleteValue,
} from "../../controllers/admin/value.controller.js";
import validate from "../../middlewares/validation/validation.middleware.js";
import { createValueSchema } from "../../validations/value/create.validation.js";
import { updateValueSchema } from "../../validations/value/update.validation.js";
import { verifyAdmin } from "../../middlewares/admin/verifyAdmin.middleware.js";

const router = express.Router();

router.post("/",verifyAdmin, validate(createValueSchema), createValue);
router.get("/", getValues);
router.get("/:id", getValueById);
router.put("/:id",verifyAdmin, validate(updateValueSchema), updateValue);
router.delete("/:id", verifyAdmin,deleteValue);

export default router;
