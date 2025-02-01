import express from "express";
import authRoutes from "../admin/auth/auth.routes.js";
import categoryRoutes from "./category.routes.js";
import brandRoutes from "./brand.routes.js";
import { verifyAdmin } from "../../middlewares/admin/verifyAdmin.middleware.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/categories", verifyAdmin, categoryRoutes);
router.use("/brands", verifyAdmin, brandRoutes);

export default router;
