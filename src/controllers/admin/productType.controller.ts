import { Request, Response } from "express";
import ProductType from "../../models/admin/productType.model.js";
import asyncHandler from "../../utils/global/asyncHandler.util.js";
import sendResponse from "../../utils/global/responseHandler.util.js";
import { STATUS_CODES } from "../../constants/global/statusCodes.constants.js";
import { CREATE_SUCCESS, GET_SUCCESS, NOT_FOUND, DELETE_SUCCESS } from "../../constants/global/message.constants.js";
import ApiError from "../../utils/global/ApiError.util.js";

export const createProductType = asyncHandler(async (req: Request, res: Response) => {
  const { name } = req.body;

  const productType = new ProductType({ name });
  await productType.save();

  sendResponse(res, STATUS_CODES.CREATED, CREATE_SUCCESS("Product Type"), productType);
});

export const getProductTypes = asyncHandler(async (req: Request, res: Response) => {
  const productTypes = await ProductType.find();
  sendResponse(res, STATUS_CODES.OK, GET_SUCCESS("Product Types"), productTypes);
});

export const getProductTypeById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const productType = await ProductType.findById(id);
  if (!productType) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, NOT_FOUND("Product Type"));
  }
  sendResponse(res, STATUS_CODES.OK, GET_SUCCESS("Product Type"), productType);
});

export const updateProductType = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;

  const productType = await ProductType.findByIdAndUpdate(id, { name }, { new: true });
  if (!productType) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, NOT_FOUND("Product Type"));
  }

  sendResponse(res, STATUS_CODES.OK, GET_SUCCESS("Product Type"), productType);
});

export const deleteProductType = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const productType = await ProductType.findByIdAndDelete(id);
  if (!productType) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, NOT_FOUND("Product Type"));
  }
  sendResponse(res, STATUS_CODES.OK, DELETE_SUCCESS("Product Type"));
});
