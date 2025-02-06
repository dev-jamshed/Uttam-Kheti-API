import ApiError from "../../utils/global/ApiError.util.js";
import { PARAM, PARAM_AND_BODY } from "../../constants/global/app.constants.js";
import { STATUS_CODES } from "../../constants/global/statusCodes.constants.js";
import { Schema, ZodSchema } from "zod";
import { Response, Request, NextFunction } from "express";

const convertStringToBoolean = (value: any) => {
  if (value === "true" || value === "1") return true;
  if (value === "false" || value === "0") return false;
  return value;
};

const convertBooleans = (obj: any) => {
  for (const key in obj) {
    if (typeof obj[key] === "string") {
      obj[key] = convertStringToBoolean(obj[key]);
    } else if (typeof obj[key] === "object" && obj[key] !== null) {
      convertBooleans(obj[key]);
    }
  }
};

const validate =
  (schema: ZodSchema, type?: string, parse?: string[]) => (req: Request, res: Response, next: NextFunction) => {
    try {
      if (parse) {
        parse.forEach((key) => (req.body[key] = JSON.parse(req.body[key])));
      }

      convertBooleans(req.body);

      if (type == PARAM) {
        schema.parse(req.params);
        return next();
      }

      if (type == PARAM_AND_BODY) {
        schema.parse({ ...req.params, ...req.body });
        return next();
      }

      schema.parse(req.body);
      next();
    } catch (error: any) {
      throw new ApiError(STATUS_CODES.BAD_REQUEST, "validation error", error.errors);
    }
  };

export default validate;
