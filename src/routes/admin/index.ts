import express from "express";
import authRoutes from "../admin/auth/auth.routes.js";
import { verifyAdmin } from "../../middlewares/admin/verifyAdmin.middleware.js";

const router = express.Router();

router.use("/admin/auth", authRoutes);
router.get("/admin", verifyAdmin, (req, res) => {
    res.send("Admin routes");
});

export default router;
