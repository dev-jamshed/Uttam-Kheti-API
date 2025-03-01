import { Request, Response } from "express";
import Admin from "../../../models/admin/admin.model.js";
import asyncHandler from "../../../utils/global/asyncHandler.util.js";
import ApiError from "../../../utils/global/ApiError.util.js";
import { STATUS_CODES } from "../../../constants/global/statusCodes.constants.js";
import sendResponse from "../../../utils/global/responseHandler.util.js";
import { OtpVerification } from "../../../models/otp.model.js";
import {
  USER_NOT_FOUND,
  OTP_INVALID_ERROR,
  OTP_VERIFIED_SUCCESS,
} from "../../../constants/global/message.constants.js";
import { generateToken } from "../../../utils/global/jwtToken.util.js";
import { JWT_TEMP_TOKEN_EXPIRES_IN } from "../../../config/env.config.js";

export const verifyOtp = asyncHandler(async (req: Request, res: Response) => {
  const { email, otp } = req.body;

  // Find admin user
  const user = await Admin.findOne({ email });
  if (!user) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, USER_NOT_FOUND);
  }

  // Find and validate OTP
  const otpRecord = await OtpVerification.findOne({
    userId: user._id,
    userType: "admin",
    otp,
    expiresAt: { $gt: new Date() },
  });

  if (!otpRecord) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, OTP_INVALID_ERROR);
  }

  // Delete the used OTP
  await otpRecord.deleteOne();

  // Generate a temporary token for password change
  const tempToken = await generateToken({ email }, JWT_TEMP_TOKEN_EXPIRES_IN as string);

  sendResponse(res, STATUS_CODES.OK, OTP_VERIFIED_SUCCESS, { tempToken });
});
