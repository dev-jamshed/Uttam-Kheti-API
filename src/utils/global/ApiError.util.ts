import { STATUS_CODES } from "../../constants/global/statusCodes.constants.js";

interface ValidationError {
  message: string;
  path: string[];
}

class ApiError extends Error {
  statusCode: number;
  errors?: ValidationError[];

  constructor(statusCode: number, message: string = "Something went wrong", errors?: ValidationError[], stack: string = "") {
    super(message);

    this.statusCode = statusCode;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;
