import express from "express";
import authRoutes from "../customer/auth/auth.routes.js";
import { verifyCustomer } from "../../middlewares/customer/verifyCustomer.middleware.js";
console.log(verifyCustomer);

const router = express.Router();

router.use("/customer/auth", authRoutes);

router.get("/customer", verifyCustomer, (req, res) => {
  res.send("customer routes");
});

export default router;
