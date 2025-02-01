import e, { Request, Response, NextFunction } from "express";
import { verifyToken } from "../../utils/global/jwtToken.util.js";
import ApiError from "../../utils/global/ApiError.util.js";
import { UNAUTHORIZED_ERROR } from "../../constants/global/message.constants.js";
import { STATUS_CODES } from "../../constants/global/statusCodes.constants.js";
import Admin from "../../models/admin/admin.model.js";
import { JwtPayload } from "jsonwebtoken";
import { NODE_ENV } from "../../config/env.config.js";

interface CustomRequest extends Request {
  user?: any;
}

export const verifyAdmin = async (req: CustomRequest, res: Response, next: NextFunction) => {
  if (NODE_ENV === "development") {
    return next();
  }
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return next(new ApiError(STATUS_CODES.UNAUTHORIZED, UNAUTHORIZED_ERROR));
  }

  try {
    const decoded = verifyToken(token) as JwtPayload;
    const admin = await Admin.findById(decoded._id);
    if (!admin) {
      return next(new ApiError(STATUS_CODES.UNAUTHORIZED, UNAUTHORIZED_ERROR));
    }
    req.user = admin;
    next();
  } catch (error) {
    next(new ApiError(STATUS_CODES.UNAUTHORIZED, UNAUTHORIZED_ERROR));
  }
};
