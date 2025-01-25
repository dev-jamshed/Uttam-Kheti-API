import express from "express";
import registerController from "../../../controllers/admin/auth/register.controller.js";
import loginController from "../../../controllers/admin/auth/login.controller.js";
import validate from "../../../middlewares/validation/validation.middleware.js";
import { adminValidation } from "../../../validations/admin/admin.validation.js";
import { requestOtp } from "../../../controllers/admin/auth/request-forget-password.controller.js";
import { changePassword } from "../../../controllers/admin/auth/change-password.controller.js";
import { verifyOtp } from "../../../controllers/admin/auth/verifyOtp.controller.js";
import { loginValidation } from "../../../validations/auth/login.validation.js";
import { changePasswordValidation } from "../../../validations/auth/changePassword.validation.js";
import { verifyOtpValidation } from "../../../validations/auth/verifyOtp.validation.js";
import { emailValidation } from "../../../validations/auth/email.validation.js";

const router = express.Router();

router.post("/login", validate(loginValidation), loginController);
router.post("/register", validate(adminValidation), registerController);
router.post("/reset-password", validate(emailValidation), requestOtp);
router.post("/verify-otp", validate(verifyOtpValidation), verifyOtp);
router.post("/change-password", validate(changePasswordValidation), changePassword);

export default router;
