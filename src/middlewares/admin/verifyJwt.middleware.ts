import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../../utils/global/jwtToken.util.js";
import ApiError from "../../utils/global/ApiError.util.js";
import { PRODUCTION, UNAUTHORIZED_ERROR } from "../../constants/global/message.constants.js";
import "../../types/express";
import { STATUS_CODES } from "../../constants/global/statusCodes.constants.js";

interface CustomRequest extends Request {
  user?: any;
}

export const verifyJwt = (req: CustomRequest, res: Response, next: NextFunction) => {
  if (process.env.ENV !== PRODUCTION) {
    return next();
  }
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    throw new ApiError(STATUS_CODES.UNAUTHORIZED, UNAUTHORIZED_ERROR);
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    next(error);
  }
};
