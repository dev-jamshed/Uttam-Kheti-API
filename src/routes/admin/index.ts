import express from "express";
import authRoutes from "../admin/auth/auth.routes.js";
import categoryRoutes from "./category.routes.js";
import { verifyAdmin } from "../../middlewares/admin/verifyAdmin.middleware.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/categories", verifyAdmin, categoryRoutes);

export default router;
