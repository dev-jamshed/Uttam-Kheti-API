import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../../config/env.config.js";
import ApiError from "./ApiError.util.js";
import { STATUS_CODES } from "../../constants/global/statusCodes.constants.js";

import { UNAUTHORIZED_ERROR } from "../../constants/global/message.constants.js";
export const generateToken = (payload: any) => {
  if (!JWT_SECRET || !JWT_EXPIRES_IN) {
    throw new ApiError(STATUS_CODES.INTERNAL_SERVER_ERROR, UNAUTHORIZED_ERROR);
  }
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};
export const verifyToken = (token: string) => {
  if (!JWT_SECRET) {
    throw new ApiError(STATUS_CODES.INTERNAL_SERVER_ERROR, UNAUTHORIZED_ERROR);
  }
  return jwt.verify(token, JWT_SECRET);
};
