import { Response } from 'express';
import ApiResponse from './ApiResponse.util.js';

const sendResponse = (res: Response, statusCode: number, data: object, message: string) => {
  res.status(statusCode).json(new ApiResponse(statusCode, data, message));
};

export default sendResponse;
