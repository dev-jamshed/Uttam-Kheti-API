import { Request, Response, NextFunction } from "express";
import ApiError from "../../utils/global/ApiError.util.js";
import { STATUS_CODES } from "../../constants/global/statusCodes.constants.js";

const errorHandler = (err: ApiError | Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);

  let statusCode = STATUS_CODES.INTERNAL_SERVER_ERROR;
  let message = "Internal Server Error";
  let errors: any[] = [];

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors;
  } else if (err instanceof SyntaxError && "body" in err) {
    statusCode = STATUS_CODES.BAD_REQUEST;
    
  } else {
    
    errors = [{ message: err.message }];
  }

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errors,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

export default errorHandler;
