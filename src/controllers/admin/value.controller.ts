import { Request, Response } from "express";
import Value from "../../models/admin/value.model.js";
import asyncHandler from "../../utils/global/asyncHandler.util.js";
import sendResponse from "../../utils/global/responseHandler.util.js";
import { STATUS_CODES } from "../../constants/global/statusCodes.constants.js";
import { CREATE_SUCCESS, GET_SUCCESS, NOT_FOUND, DELETE_SUCCESS } from "../../constants/global/message.constants.js";
import ApiError from "../../utils/global/ApiError.util.js";

export const createValue = asyncHandler(async (req: Request, res: Response) => {
  const { attribute_id, name } = req.body;

  const value = new Value({ attribute_id, name });
  await value.save();

  sendResponse(res, STATUS_CODES.CREATED, CREATE_SUCCESS("Value"), value);
});

export const getValues = asyncHandler(async (req: Request, res: Response) => {
  const values = await Value.find().populate("attribute_id");
  sendResponse(res, STATUS_CODES.OK, GET_SUCCESS("Values"), values);
});

export const getValueById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const value = await Value.findById(id).populate("attribute");
  if (!value) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, NOT_FOUND("Value"));
  }
  sendResponse(res, STATUS_CODES.OK, GET_SUCCESS("Value"), value);
});

export const updateValue = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { attribute_id, name } = req.body;

  const value = await Value.findByIdAndUpdate(id, { attribute_id, name }, { new: true });
  if (!value) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, NOT_FOUND("Value"));
  }

  sendResponse(res, STATUS_CODES.OK, GET_SUCCESS("Value"), value);
});

export const deleteValue = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const value = await Value.findByIdAndDelete(id);
  if (!value) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, NOT_FOUND("Value"));
  }
  sendResponse(res, STATUS_CODES.OK, DELETE_SUCCESS("Value"));
});
