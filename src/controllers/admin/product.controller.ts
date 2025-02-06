import { Request, Response } from "express";
import Product from "../../models/admin/product.model.js";
import Attribute from "../../models/admin/attribute.model.js";
import ProductAttributeValue from "../../models/admin/productAttributeValue.model.js";
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
import ProductImage from "../../models/admin/productImage.model.js";

export const createProduct = asyncHandler(async (req: Request, res: Response) => {
  const { name, description, category, brand, price, crossPrice, attributeValues } = req.body;

  // Check if product with the same name already exists
  const existingProduct = await Product.findOne({ name });
  if (existingProduct) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, ALREADY_EXISTS("Product"));
  }

  let mainImage;
  const additionalImages: string[] = [];
  if (req.files) {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const mainImageFile = files["mainImage"] ? files["mainImage"][0] : null;
    const imageFiles = files["additionalImages"] || [];

    if (mainImageFile) {
      mainImage = await uploadFileToS3(mainImageFile.buffer, mainImageFile.originalname, mainImageFile.mimetype);
    }

    for (const file of imageFiles) {
      const imageUrl = await uploadFileToS3(file.buffer, file.originalname, file.mimetype);
      additionalImages.push(imageUrl);
    }
  }

  // if (!mainImage) {
  //   throw new ApiError(STATUS_CODES.BAD_REQUEST, "Main image is required");
  // }

  const slug = convert(name);
  const product = new Product({ name, description, category, brand, mainImage, slug, price, crossPrice });
  await product.save();

  if (attributeValues && Array.isArray(attributeValues)) {
    for (const { attribute_id, value_id } of attributeValues) {
      await new ProductAttributeValue({ product_id: product._id, value_id }).save();
    }
  }

  for (const imageUrl of additionalImages) {
    await new ProductImage({ product: product._id, url: imageUrl }).save();
  }

  const fullProduct = await Product.findById(product._id)
    .populate("category", "name")
    .select("name slug description category mainImage")
    .lean();

  if (!fullProduct) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, "Product not found");
  }

  fullProduct.id = fullProduct._id;

  sendResponse(res, STATUS_CODES.CREATED, CREATE_SUCCESS("Product"), fullProduct);
});

export const getProducts = asyncHandler(async (req: Request, res: Response) => {
  const products = await Product.find()
    .populate("category", "name slug image")
    .populate("brand", "name slug image")
    .populate("productImages", "url")
    .populate({
      path: "attributeValues",
      populate: {
        path: "value_id",
        model: "Value",
        populate: {
          path: "attribute_id",
          model: "Attribute",
          select: "name",
        },
        select: "name",
      },
    })
    .lean();

  products.forEach(product => {
    delete product.id;
    if (product.attributeValues) {
      product.attributeValues.forEach(attributeValue => {
        delete attributeValue.id;
        delete attributeValue.value_id.id;
        delete attributeValue.value_id.attribute_id.id;
      });
    }
  });

  sendResponse(res, STATUS_CODES.OK, GET_SUCCESS("Products"), products);
});

export const getProductById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await Product.findById(id)
    .populate("category", "name slug image")
    .populate("brand", "name slug image")
    .populate("productImages", "url")
    .populate({
      path: "attributeValues",
      populate: {
        path: "value_id",
        model: "Value",
        populate: {
          path: "attribute_id",
          model: "Attribute",
          select: "name",
        },
        select: "name",
      },
    })
    .lean();

  if (!product) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, NOT_FOUND("Product"));
  }

  delete product.id;
  if (product.attributeValues) {
    product.attributeValues.forEach(attributeValue => {
      delete attributeValue.id;
      delete attributeValue.value_id.id;
      delete attributeValue.value_id.attribute_id.id;
    });
  }

  sendResponse(res, STATUS_CODES.OK, GET_SUCCESS("Product"), product);
});

export const updateProduct = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description, category, brand, price, crossPrice, attributeValues } = req.body;

  // Check if product with the same name already exists
  const existingProduct = await Product.findOne({ name, _id: { $ne: id } });
  if (existingProduct) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, ALREADY_EXISTS("Product"));
  }

  let mainImage;
  const additionalImages: string[] = [];
  if (req.files) {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const mainImageFile = files["mainImage"] ? files["mainImage"][0] : null;
    const imageFiles = files["additionalImages"] || [];

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

  // if (!mainImage) {
  //   throw new ApiError(STATUS_CODES.BAD_REQUEST, "Main image is required");
  // }

  const slug = convert(name);
  const updatedProduct = await Product.findByIdAndUpdate(
    id,
    { name, description, category, brand, mainImage, slug, price, crossPrice },
    { new: true }
  );
  if (!updatedProduct) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, NOT_FOUND("Product"));
  }

  if (attributeValues && Array.isArray(attributeValues)) {
    await ProductAttributeValue.deleteMany({ product_id: id });
    for (const { attribute_id, value_id } of attributeValues) {
      await new ProductAttributeValue({ product_id: updatedProduct._id, value_id }).save();
    }
  }

  for (const imageUrl of additionalImages) {
    await new ProductImage({ product: updatedProduct._id, url: imageUrl }).save();
  }

  const fullProduct = await Product.findById(updatedProduct._id)
    .populate("category", "name")
    .select("name slug description category mainImage")
    .lean();

  if (!fullProduct) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, "Product not found");
  }

  fullProduct.id = fullProduct._id;

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
