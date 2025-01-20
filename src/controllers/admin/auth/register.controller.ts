import { Request, Response } from "express";
import Admin from "../../../models/admin/admin.model.js";
import asyncHandler from "../../../utils/global/asyncHandler.util.js";
import ApiError from "../../../utils/global/ApiError.util.js";
import { STATUS_CODES } from "../../../constants/global/statusCodes.constants.js";
import sendResponse from "../../../utils/global/responseHandler.util.js";
import { sendEmail } from "../../../utils/global/email.util.js";

const registerController = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, phone, password } = req.body;
  const userExist = await Admin.findOne({ email });
  
  if (userExist) {
    throw new ApiError(STATUS_CODES.CONFLICT, "User already exists");
  }
  const user = await Admin.create({
    name,
    email,
    phone,
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

  sendResponse(res, STATUS_CODES.CREATED, userWithoutPassword, "User Registered Successfully");
});

export default registerController;
