import express from "express";
import registerController from "../../../controllers/admin/auth/register.controller.js";
import loginController from "../../../controllers/admin/auth/login.controller.js";
import validate from "../../../middlewares/validation/validation.middleware.js";
import { adminValidation } from "../../../validations/admin/admin.validation.js";
// import { requestOtp } from "../../../controllers/admin/auth/request-forget-password.controller.js";
const router = express.Router();

router.post("/login", loginController);
router.post("/register", validate(adminValidation), registerController);
// router.post("/reset-password",requestOtp)

export default router;
