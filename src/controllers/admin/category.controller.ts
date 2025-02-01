import { Request, Response } from "express";
import Category from "../../models/admin/category.model.js";
import asyncHandler from "../../utils/global/asyncHandler.util.js";
import sendResponse from "../../utils/global/responseHandler.util.js";
import { STATUS_CODES } from "../../constants/global/statusCodes.constants.js";
import { CREATE_SUCCESS, GET_SUCCESS, NOT_FOUND, ALREADY_EXISTS, DELETE_SUCCESS } from "../../constants/global/message.constants.js";
import ApiError from "../../utils/global/ApiError.util.js";
import { uploadFileToS3 } from "../../utils/global/s3Upload.util.js";
import { convert } from 'url-slug';
import deleteFileFromS3 from "../../utils/global/s3Delete.util.js";

export const createCategory = asyncHandler(async (req: Request, res: Response) => {
  const { name, description, parent, meta_title, meta_description, meta_keywords, is_featured, feature_in_banner } = req.body;

  // Check if category with the same name already exists
  const existingCategory = await Category.findOne({ name });
  if (existingCategory) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, ALREADY_EXISTS("Category"));
  }

  let image;
  if (req.file) {
    image = await uploadFileToS3(req.file.buffer, req.file.originalname, req.file.mimetype);
  }
  const slug = convert(name);
  const category = new Category({ name, description, parent, image, meta_title, meta_description, meta_keywords, is_featured, feature_in_banner, slug });
  await category.save();
  sendResponse(res, STATUS_CODES.CREATED, CREATE_SUCCESS("Category"), category);
});

export const getCategories = asyncHandler(async (req: Request, res: Response) => {
  const categories = await Category.aggregate([
    {
      $match: { parent: { $exists: false } }
    },
    {
      $lookup: {
        from: 'categories',
        localField: '_id',
        foreignField: 'parent',
        as: 'children'
      }
    }
  ]);
  sendResponse(res, STATUS_CODES.OK, GET_SUCCESS("Categories"), categories);
});

export const getCategoryById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const category = await Category.findById(id).populate('parent');
  if (!category) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, NOT_FOUND("Category"));
  }
  sendResponse(res, STATUS_CODES.OK, GET_SUCCESS("Category"), category);
});

export const updateCategory = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description, parent, meta_title, meta_description, meta_keywords, is_featured, feature_in_banner } = req.body;

  // Check if category with the same name already exists
  const existingCategory = await Category.findOne({ name, _id: { $ne: id } });
  if (existingCategory) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, ALREADY_EXISTS("Category"));
  }

  let image;
  if (req.file) {
    const category = await Category.findById(id);
    if (category && category.image) {
      // Remove the old image from S3
      await deleteFileFromS3(category.image);
    }
    image = await uploadFileToS3(req.file.buffer, req.file.originalname, req.file.mimetype);
  }

  const slug = convert(name);
  const category = await Category.findByIdAndUpdate(id, { name, description, parent, image, meta_title, meta_description, meta_keywords, is_featured, feature_in_banner, slug }, { new: true });
  if (!category) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, NOT_FOUND("Category"));
  }
  sendResponse(res, STATUS_CODES.OK, GET_SUCCESS("Category"), category);
});

export const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const category = await Category.findByIdAndDelete(id);
  if (!category) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, NOT_FOUND("Category"));
  }
  if (category.image) {
    // Remove the image from S3
    await deleteFileFromS3(category.image);
  }
  sendResponse(res, STATUS_CODES.OK, DELETE_SUCCESS("Category"));
});