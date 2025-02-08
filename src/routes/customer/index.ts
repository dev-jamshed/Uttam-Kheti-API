import express from "express";
import authRoutes from "../customer/auth/auth.routes.js";
import wishlistRoutes from "./wishlist.routes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/wishlist", wishlistRoutes);

export default router;
