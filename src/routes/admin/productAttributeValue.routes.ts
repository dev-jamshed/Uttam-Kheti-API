import express from "express";
import { deleteProductAttributeValue } from "../../controllers/admin/productAttributeValue.controller.js";

const router = express.Router();

router.delete("/:id", deleteProductAttributeValue);

export default router;
