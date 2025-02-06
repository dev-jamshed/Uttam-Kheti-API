import express from "express";
import {
  createAttribute,
  getAttributes,
  getAttributeById,
  updateAttribute,
  deleteAttribute,
} from "../../controllers/admin/attribute.controller.js";
import validate from "../../middlewares/validation/validation.middleware.js";
import { createAttributeSchema } from "../../validations/attribute/create.validation.js";
import { updateAttributeSchema } from "../../validations/attribute/update.validation.js";
import { verifyAdmin } from "../../middlewares/admin/verifyAdmin.middleware.js";

const router = express.Router();

router.post("/",verifyAdmin, validate(createAttributeSchema), createAttribute);
router.get("/", getAttributes);
router.get("/:id", getAttributeById);
router.put("/:id",verifyAdmin, validate(updateAttributeSchema), updateAttribute);
router.delete("/:id",verifyAdmin, deleteAttribute);

export default router;
