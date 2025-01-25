import { Request, Response } from "express";
import Admin from "../../../models/admin/admin.model.js";
import asyncHandler from "../../../utils/global/asyncHandler.util.js";
import ApiError from "../../../utils/global/ApiError.util.js";
import { STATUS_CODES } from "../../../constants/global/statusCodes.constants.js";
import { OTP_SENT_SUCCESS, USER_NOT_FOUND } from "../../../constants/global/message.constants.js";
import { OTP_EXPIRES_IN } from "../../../config/env.config.js";
import { OtpVerification } from "../../../models/otp.model.js";
import sendResponse from "../../../utils/global/responseHandler.util.js";
import { sendEmail } from "../../../utils/global/email.util.js";
import mongoose from "mongoose";

// Request new OTP
export const requestOtp = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;

  // Find admin user
  const user = await Admin.findOne({ email });
  if (!user) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, USER_NOT_FOUND);
  }

  // Delete any existing OTP for this user
  await OtpVerification.deleteMany({
    userId: user._id,
    userType: "admin",
  });

  // Generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpiryMinutes = parseInt(OTP_EXPIRES_IN || "5", 10);

  // Create OTP using the static method
  await OtpVerification.createOTP(user._id as mongoose.Schema.Types.ObjectId, "admin", otp, otpExpiryMinutes);

  // Send OTP via email
  await sendEmail({
    to: email,
    subject: "Password Reset OTP",
    template: "otp",
    context: {
      name: user.name,
      otp: otp,
    },
  });
  sendResponse(res, STATUS_CODES.OK, OTP_SENT_SUCCESS);
});
