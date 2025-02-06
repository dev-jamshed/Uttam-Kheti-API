import express from "express";
import authRoutes from "../admin/auth/auth.routes.js";
import categoryRoutes from "./category.routes.js";
import brandRoutes from "./brand.routes.js";
import productRoutes from "./product.routes.js";
import productTypeRoutes from "./productType.routes.js";
import attributeRoutes from "./attribute.routes.js";
import valueRoutes from "./value.routes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/categories", categoryRoutes);
router.use("/brands", brandRoutes);
router.use("/products", productRoutes);
router.use("/product-types", productTypeRoutes);
router.use("/attributes", attributeRoutes);
router.use("/values", valueRoutes);

export default router;
