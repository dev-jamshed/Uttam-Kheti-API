import bcrypt from "bcrypt";
import Customer from "../../../models/customer/customer.model.js";
import asyncHandler from "../../../utils/global/asyncHandler.util.js";
import ApiError from "../../../utils/global/ApiError.util.js";
import sendResponse from "../../../utils/global/responseHandler.util.js";

import { STATUS_CODES } from "../../../constants/global/statusCodes.constants.js";
import { INVALID_CREDENTIALS, LOGIN_SUCCESS } from "../../../constants/global/message.constants.js";
import { generateToken } from "../../../utils/global/jwtToken.util.js";
import { Request, Response } from "express";
import { JWT_EXPIRES_IN } from "../../../config/env.config.js";

const loginController = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Find customer
  const user = await Customer.findOne({ email }).select("_id name email password");

  if (!user) {
    throw new ApiError(STATUS_CODES.UNAUTHORIZED, INVALID_CREDENTIALS);
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new ApiError(STATUS_CODES.UNAUTHORIZED, INVALID_CREDENTIALS);
  }
  const { password: _, ...userWithoutPassword } = user.toObject();
  const token = generateToken({ _id: user._id, name: user.name }, JWT_EXPIRES_IN as string);
  sendResponse(res, STATUS_CODES.OK, LOGIN_SUCCESS, { user: { ...userWithoutPassword, token } });
});

export default loginController;
