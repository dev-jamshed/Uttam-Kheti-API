import { Request, Response } from "express";
import Brand from "../../models/admin/brand.model.js";
import asyncHandler from "../../utils/global/asyncHandler.util.js";
import sendResponse from "../../utils/global/responseHandler.util.js";
import { STATUS_CODES } from "../../constants/global/statusCodes.constants.js";
import {
  CREATE_SUCCESS,
  GET_SUCCESS,
  NOT_FOUND,
  ALREADY_EXISTS,
  DELETE_SUCCESS,
} from "../../constants/global/message.constants.js";
import ApiError from "../../utils/global/ApiError.util.js";
import { uploadFileToS3 } from "../../utils/global/s3Upload.util.js";
import deleteFileFromS3 from "../../utils/global/s3Delete.util.js";
import { convert } from "url-slug";

export const createBrand = asyncHandler(async (req: Request, res: Response) => {
  const { name, description } = req.body;

  // Check if brand with the same name or slug already exists
  const slug = convert(name);
  const existingBrand = await Brand.findOne({ $or: [{ name }, { slug }] });
  if (existingBrand) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, ALREADY_EXISTS("Brand"));
  }

  let image;
  if (req.file) {
    image = await uploadFileToS3(req.file.buffer, req.file.originalname, req.file.mimetype);
  }
  const brand = new Brand({ name, description, image, slug });
  await brand.save();
  sendResponse(res, STATUS_CODES.CREATED, CREATE_SUCCESS("Brand"), brand);
});

export const getBrands = asyncHandler(async (req: Request, res: Response) => {
  const brands = await Brand.find();
  sendResponse(res, STATUS_CODES.OK, GET_SUCCESS("Brands"), brands);
});

export const getBrandById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const brand = await Brand.findById(id);
  if (!brand) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, NOT_FOUND("Brand"));
  }
  sendResponse(res, STATUS_CODES.OK, GET_SUCCESS("Brand"), brand);
});

export const updateBrand = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description } = req.body;

  // Check if brand with the same name or slug already exists
  const slug = convert(name);
  const existingBrand = await Brand.findOne({ $or: [{ name }, { slug }], _id: { $ne: id } });
  if (existingBrand) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, ALREADY_EXISTS("Brand"));
  }

  let image;
  if (req.file) {
    const brand = await Brand.findById(id);
    if (brand && brand.image) {
      // Remove the old image from S3
      await deleteFileFromS3(brand.image);
    }
    image = await uploadFileToS3(req.file.buffer, req.file.originalname, req.file.mimetype);
  }

  const brand = await Brand.findByIdAndUpdate(id, { name, description, image, slug }, { new: true });
  if (!brand) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, NOT_FOUND("Brand"));
  }
  sendResponse(res, STATUS_CODES.OK, GET_SUCCESS("Brand"), brand);
});

export const deleteBrand = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const brand = await Brand.findByIdAndDelete(id);
  if (!brand) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, NOT_FOUND("Brand"));
  }
  if (brand.image) {
    // Remove the image from S3
    await deleteFileFromS3(brand.image);
  }
  sendResponse(res, STATUS_CODES.OK, DELETE_SUCCESS("Brand"));
});
