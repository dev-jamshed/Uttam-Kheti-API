import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../../utils/global/jwtToken.util.js";
import ApiError from "../../utils/global/ApiError.util.js";
import { UNAUTHORIZED_ERROR } from "../../constants/global/message.constants.js";
import { STATUS_CODES } from "../../constants/global/statusCodes.constants.js";
import Customer from "../../models/customer/customer.model.js";
import asyncHandler from "../../utils/global/asyncHandler.util.js";

interface CustomRequest extends Request {
  user?: any;
}

export const verifyCustomer = asyncHandler(async (req: CustomRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return next(new ApiError(STATUS_CODES.UNAUTHORIZED, UNAUTHORIZED_ERROR));
  }

  try {
    const decoded = verifyToken(token);
    const customer = await Customer.findById(decoded._id);
    if (!customer) {
      return next(new ApiError(STATUS_CODES.UNAUTHORIZED, UNAUTHORIZED_ERROR));
    }
    req.user = customer;
    next();
  } catch (error) {
    next(new ApiError(STATUS_CODES.UNAUTHORIZED, UNAUTHORIZED_ERROR));
  }
});
