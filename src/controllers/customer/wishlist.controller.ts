import { Request, Response } from "express";
import Wishlist from "../../models/customer/wishlist.model.js";
import asyncHandler from "../../utils/global/asyncHandler.util.js";
import sendResponse from "../../utils/global/responseHandler.util.js";
import { STATUS_CODES } from "../../constants/global/statusCodes.constants.js";
import { CREATE_SUCCESS, GET_SUCCESS, DELETE_SUCCESS, NOT_FOUND, ALREADY_EXISTS } from "../../constants/global/message.constants.js";
import ApiError from "../../utils/global/ApiError.util.js";
import { ICustomer } from "../../models/customer/customer.model.js"; // Adjust the import based on your user model location

declare global {
  namespace Express {
    interface Request {
      user?: ICustomer;
    }
  }
}

export const addToWishlist = asyncHandler(async (req: Request, res: Response) => {
  const { product_id } = req.body;
  const customer_id = req.user?._id;

  // Check if the product is already in the wishlist
  const existingWishlistItem = await Wishlist.findOne({ customer_id, product_id });
  if (existingWishlistItem) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, ALREADY_EXISTS("Product in wishlist"));
  }

  const wishlistItem = new Wishlist({ customer_id, product_id });
  await wishlistItem.save();

  sendResponse(res, STATUS_CODES.CREATED, CREATE_SUCCESS("Wishlist item"), wishlistItem);
});

export const getWishlist = asyncHandler(async (req: Request, res: Response) => {
  const customer_id = req.user?._id;

  const wishlist = await Wishlist.find({ customer_id })
    .populate({
      path: "product_id",
      populate: [
        { path: "category", select: "name slug image" },
        { path: "brand", select: "name slug image" },
        { path: "productImages", select: "url" },
        {
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
        },
      ],
    })
    .lean();

  wishlist.forEach(item => {
    const product = item.product_id as any;
    if (product && product.attributeValues) {
      product.attributeValues.forEach((attributeValue: { value_id: { attribute_id: { _id: any; }; _id: any; }; _id: any; }) => {
        if (attributeValue.value_id && attributeValue.value_id.attribute_id) {
          delete attributeValue.value_id.attribute_id._id;
        }
        delete attributeValue.value_id._id;
        delete attributeValue._id;
      });
    }
  });

  sendResponse(res, STATUS_CODES.OK, GET_SUCCESS("Wishlist"), wishlist);
});

export const removeFromWishlist = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const wishlistItem = await Wishlist.findByIdAndDelete(id);
  if (!wishlistItem) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, NOT_FOUND("Wishlist item"));
  }

  sendResponse(res, STATUS_CODES.OK, DELETE_SUCCESS("Wishlist item"));
});
