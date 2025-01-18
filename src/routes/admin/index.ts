import express from "express";
import authRoutes from "../admin/auth/auth.routes.js";

const router = express.Router();

router.use("/admin/auth", authRoutes);

export default router;
