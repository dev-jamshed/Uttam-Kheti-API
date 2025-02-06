import { Request, Response } from "express";
import Attribute from "../../models/admin/attribute.model.js";
import ProductType from "../../models/admin/productType.model.js";
import asyncHandler from "../../utils/global/asyncHandler.util.js";
import sendResponse from "../../utils/global/responseHandler.util.js";
import { STATUS_CODES } from "../../constants/global/statusCodes.constants.js";
import { CREATE_SUCCESS, GET_SUCCESS, NOT_FOUND, DELETE_SUCCESS } from "../../constants/global/message.constants.js";
import ApiError from "../../utils/global/ApiError.util.js";

export const createAttribute = asyncHandler(async (req: Request, res: Response) => {
  const { productType, name, values } = req.body;

  // Check if the product type exists
  const existingProductType = await ProductType.findById(productType);
  if (!existingProductType) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, NOT_FOUND("Product Type"));
  }

  const attribute = new Attribute({ productType, name, values });
  await attribute.save();

  sendResponse(res, STATUS_CODES.CREATED, CREATE_SUCCESS("Attribute"), attribute);
});

export const getAttributes = asyncHandler(async (req: Request, res: Response) => {
  const attributes = await Attribute.find().populate("productType");
  sendResponse(res, STATUS_CODES.OK, GET_SUCCESS("Attributes"), attributes);
});

export const getAttributeById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const attribute = await Attribute.findById(id).populate("productType");
  if (!attribute) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, NOT_FOUND("Attribute"));
  }
  sendResponse(res, STATUS_CODES.OK, GET_SUCCESS("Attribute"), attribute);
});

export const updateAttribute = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { productType, name, values } = req.body;

  // Check if the product type exists
  const existingProductType = await ProductType.findById(productType);
  if (!existingProductType) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, NOT_FOUND("Product Type"));
  }

  const attribute = await Attribute.findByIdAndUpdate(id, { productType, name, values }, { new: true });
  if (!attribute) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, NOT_FOUND("Attribute"));
  }

  sendResponse(res, STATUS_CODES.OK, GET_SUCCESS("Attribute"), attribute);
});

export const deleteAttribute = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const attribute = await Attribute.findByIdAndDelete(id);
  if (!attribute) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, NOT_FOUND("Attribute"));
  }
  sendResponse(res, STATUS_CODES.OK, DELETE_SUCCESS("Attribute"));
});
