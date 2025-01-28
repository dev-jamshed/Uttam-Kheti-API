import { Request, Response } from "express";
import Customer from "../../../models/customer/customer.model.js";
import asyncHandler from "../../../utils/global/asyncHandler.util.js";
import ApiError from "../../../utils/global/ApiError.util.js";
import { STATUS_CODES } from "../../../constants/global/statusCodes.constants.js";
import sendResponse from "../../../utils/global/responseHandler.util.js";
import { OtpVerification } from "../../../models/otp.model.js";
import {
  NOT_FOUND_ERROR,
  OTP_INVALID_ERROR,
  OTP_VERIFIED_SUCCESS,
} from "../../../constants/global/message.constants.js";
import { generateToken } from "../../../utils/global/jwtToken.util.js";
import { JWT_TEMP_TOKEN_EXPIRES_IN } from "../../../config/env.config.js";

export const verifyOtp = asyncHandler(async (req: Request, res: Response) => {
  const { email, otp } = req.body;
  // Find customer user
  const user = await Customer.findOne({ email });
  if (!user) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, NOT_FOUND_ERROR);
  }

  // Find and validate OTP
  const otpRecord = await OtpVerification.findOne({
    userId: user._id,
    userType: "customer",
    otp,
    expiresAt: { $gt: new Date() },
  });

  if (!otpRecord) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, OTP_INVALID_ERROR);
  }

  const tempToken = await generateToken({ email }, JWT_TEMP_TOKEN_EXPIRES_IN as string);

  sendResponse(res, STATUS_CODES.OK, OTP_VERIFIED_SUCCESS, { tempToken });
});
