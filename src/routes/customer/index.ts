
import express from "express";
import authRoutes from "../customer/auth/auth.routes.js";

const router = express.Router();

router.use("/customer/auth", authRoutes);

export default router;
