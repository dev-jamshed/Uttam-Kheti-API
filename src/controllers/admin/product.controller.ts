import { Request, Response } from "express";
import Product from "../../models/admin/product.model.js";
import ProductImage from "../../models/admin/productImage.model.js";
import asyncHandler from "../../utils/global/asyncHandler.util.js";
import sendResponse from "../../utils/global/responseHandler.util.js";
import { STATUS_CODES } from "../../constants/global/statusCodes.constants.js";
import { CREATE_SUCCESS, GET_SUCCESS, NOT_FOUND, ALREADY_EXISTS, DELETE_SUCCESS } from "../../constants/global/message.constants.js";
import ApiError from "../../utils/global/ApiError.util.js";
import { uploadFileToS3 } from "../../utils/global/s3Upload.util.js";
import deleteFileFromS3 from "../../utils/global/s3Delete.util.js";
import { convert } from 'url-slug';

export const createProduct = asyncHandler(async (req: Request, res: Response) => {
  const { name, description, category, brand, attributes } = req.body;

  const slug = convert(name);
  const existingProduct = await Product.findOne({ $or: [{ name }, { slug }] });
  if (existingProduct) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, "validation error", [{
      message: "Product with the same name or slug already exists",
      path: ["name", "slug"],
    }]);
  }

  let mainImage;
  const additionalImages: string[] = [];
  if (req.files) {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const mainImageFile = files['mainImage'] ? files['mainImage'][0] : null;
    const imageFiles = files['additionalImages'] || [];

    if (mainImageFile) {
      mainImage = await uploadFileToS3(mainImageFile.buffer, mainImageFile.originalname, mainImageFile.mimetype);
    }

    for (const file of imageFiles) {
      const imageUrl = await uploadFileToS3(file.buffer, file.originalname, file.mimetype);
      additionalImages.push(imageUrl);
    }
  }

  if (!mainImage) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, "validation error", [{
      message: "Main image is required",
      path: ["mainImage"],
    }]);
  }

  const product = new Product({ name, description, category, brand, attributes, mainImage, slug });
  await product.save();

  for (const imageUrl of additionalImages) {
    await new ProductImage({ product: product._id, url: imageUrl }).save();
  }

  const fullProduct = await Product.findById(product._id).populate('category').populate('brand').populate('productImages');
  if (!fullProduct) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, NOT_FOUND("Product"));
  }

  sendResponse(res, STATUS_CODES.CREATED, CREATE_SUCCESS("Product"), fullProduct);
});

export const getProducts = asyncHandler(async (req: Request, res: Response) => {
  const products = await Product.find().populate('category').populate('brand').populate('productImages');
  sendResponse(res, STATUS_CODES.OK, GET_SUCCESS("Products"), products);
});

export const getProductById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await Product.findById(id).populate('category').populate('brand').populate('productImages');
  if (!product) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, NOT_FOUND("Product"));
  }
  sendResponse(res, STATUS_CODES.OK, GET_SUCCESS("Product"), product);
});

export const updateProduct = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description, category, brand, attributes } = req.body;

  const slug = convert(name);
  const existingProduct = await Product.findOne({ $or: [{ name }, { slug }], _id: { $ne: id } });
  if (existingProduct) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, "validation error", [{
      message: "Product with the same name or slug already exists",
      path: ["name", "slug"],
    }]);
  }

  let mainImage;
  const additionalImages: string[] = [];
  if (req.files) {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const mainImageFile = files['mainImage'] ? files['mainImage'][0] : null;
    const imageFiles = files['additionalImages'] || [];

    const product = await Product.findById(id);
    if (product) {
      if (product.mainImage) {
        await deleteFileFromS3(product.mainImage);
      }
      const images = await ProductImage.find({ product: product._id });
      for (const image of images) {
        await deleteFileFromS3(image.url);
        await ProductImage.deleteOne({ _id: image._id });
      }
    }

    if (mainImageFile) {
      mainImage = await uploadFileToS3(mainImageFile.buffer, mainImageFile.originalname, mainImageFile.mimetype);
    }

    for (const file of imageFiles) {
      const imageUrl = await uploadFileToS3(file.buffer, file.originalname, file.mimetype);
      additionalImages.push(imageUrl);
    }
  }

  if (!mainImage) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, "validation error", [{
      message: "Main image is required",
      path: ["mainImage"],
    }]);
  }

  const product = await Product.findByIdAndUpdate(id, { name, description, category, brand, attributes, mainImage, slug }, { new: true });
  if (!product) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, NOT_FOUND("Product"));
  }

  for (const imageUrl of additionalImages) {
    await new ProductImage({ product: product._id, url: imageUrl }).save();
  }

  const fullProduct = await Product.findById(product._id).populate('category').populate('brand').populate('productImages');
  if (!fullProduct) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, NOT_FOUND("Product"));
  }

  sendResponse(res, STATUS_CODES.OK, GET_SUCCESS("Product"), fullProduct);
});

export const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await Product.findByIdAndDelete(id);
  if (!product) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, NOT_FOUND("Product"));
  }
  if (product.mainImage) {
    await deleteFileFromS3(product.mainImage);
  }
  const images = await ProductImage.find({ product: product._id });
  for (const image of images) {
    await deleteFileFromS3(image.url);
    await ProductImage.deleteOne({ _id: image._id });
  }
  sendResponse(res, STATUS_CODES.OK, DELETE_SUCCESS("Product"));
});
