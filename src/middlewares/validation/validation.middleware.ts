import ApiError from "../../utils/global/ApiError.util.js";
import { PARAM, PARAM_AND_BODY } from "../../constants/global/app.constants.js";
import { STATUS_CODES } from "../../constants/global/statusCodes.constants.js";
import { Schema } from "zod";
import { Response, Request, NextFunction } from "express";

const convertStringToBoolean = (value: any) => {
  if (value === "true" || value === "1") return true;
  if (value === "false" || value === "0") return false;
  return value;
};

const validate =
  (schema: Schema, type?: string, parse?: string[]) => (req: Request, res: Response, next: NextFunction) => {
    try {
      if (parse) {
        parse.forEach((key) => (req.body[key] = JSON.parse(req.body[key])));
      }

      // Convert string values to booleans
      if (req.body.is_featured !== undefined) {
        req.body.is_featured = convertStringToBoolean(req.body.is_featured);
      }
      if (req.body.feature_in_banner !== undefined) {
        req.body.feature_in_banner = convertStringToBoolean(req.body.feature_in_banner);
      }

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
