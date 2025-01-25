import { Response } from "express";
import ApiResponse from "./ApiResponse.util.js";

const sendResponse = (res: Response, statusCode: number, message: string, data?: object) => {
  res.status(statusCode).json(new ApiResponse(statusCode, message, data));
};

export default sendResponse;
