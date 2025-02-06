import { Request, Response } from "express";
import ProductAttributeValue from "../../models/admin/productAttributeValue.model.js";
import asyncHandler from "../../utils/global/asyncHandler.util.js";
import sendResponse from "../../utils/global/responseHandler.util.js";
import { STATUS_CODES } from "../../constants/global/statusCodes.constants.js";
import { DELETE_SUCCESS, NOT_FOUND } from "../../constants/global/message.constants.js";
import ApiError from "../../utils/global/ApiError.util.js";

export const deleteProductAttributeValue = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const productAttributeValue = await ProductAttributeValue.findByIdAndDelete(id);
  if (!productAttributeValue) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, NOT_FOUND("Product Attribute Value"));
  }
  sendResponse(res, STATUS_CODES.OK, DELETE_SUCCESS("Product Attribute Value"));
});
