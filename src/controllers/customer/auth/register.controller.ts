import { Request, Response } from "express";
import Customer from "../../../models/customer/customer.model.js";
import asyncHandler from "../../../utils/global/asyncHandler.util.js";
import ApiError from "../../../utils/global/ApiError.util.js";
import { STATUS_CODES } from "../../../constants/global/statusCodes.constants.js";
import sendResponse from "../../../utils/global/responseHandler.util.js";
import { sendEmail } from "../../../utils/global/email.util.js";
import { USER_ALREADY_EXISTS, USER_CREATED_SUCCESS } from "../../../constants/global/message.constants.js";

const registerController = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, phone, address, password } = req.body;
  const userExist = await Customer.findOne({ email });

  if (userExist) {
    throw new ApiError(STATUS_CODES.CONFLICT, USER_ALREADY_EXISTS);
  }
  const user = await Customer.create({
    name,
    email,
    phone,
    address,
    password,
  });
  if (!user) {
    throw new ApiError(STATUS_CODES.INTERNAL_SERVER_ERROR, "Something went wrong while User Registration");
  }
  const { password: _, ...userWithoutPassword } = user.toObject();

  // Send welcome email
  await sendEmail({
    to: email,
    subject: "Welcome to Uttam Kheti",
    template: "welcome",
    context: { name },
  });

  sendResponse(res, STATUS_CODES.CREATED,USER_CREATED_SUCCESS,userWithoutPassword);
});

export default registerController;
