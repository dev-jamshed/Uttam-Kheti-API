import express from "express";
import registerController from "../../../controllers/customer/auth/register.controller.js";
import loginController from "../../../controllers/customer/auth/login.controller.js";
import validate from "../../../middlewares/validation/validation.middleware.js";
import { customerValidation } from "../../../validations/customer/customer.validation.js";
import { requestOtp } from "../../../controllers/customer/auth/request-forget-password.controller.js";
import { changePassword } from "../../../controllers/customer/auth/change-password.controller.js";
import { loginValidation } from "../../../validations/auth/login.validation.js";
import { changePasswordValidation } from "../../../validations/auth/changePassword.validation.js";
import { verifyOtpValidation } from "../../../validations/auth/verifyOtp.validation.js";
import { emailValidation } from "../../../validations/auth/email.validation.js";
import { verifyOtp } from "../../../controllers/customer/auth/verifyOtp.controller.js";

const router = express.Router();

router.post("/login", validate(loginValidation), loginController);
router.post("/register", validate(customerValidation), registerController);
router.post("/reset-password", validate(emailValidation), requestOtp);
router.post("/verify-otp", validate(verifyOtpValidation), verifyOtp);
router.post("/change-password", validate(changePasswordValidation), changePassword);

export default router;
