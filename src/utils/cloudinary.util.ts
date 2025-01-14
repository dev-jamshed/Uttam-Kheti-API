import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { STATUS_CODES } from "../constants/statusCodes.js";
import { INTERNAL_SERVER_ERROR } from "../constants/message.js";
import ApiError from "../utils/ApiError.util.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath: string) => {
  if (!localFilePath) {
    return null;
  }
  try {
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath);
    console.error("Error on Uploading File in Cloudinary ❌", error);
    throw new ApiError(
      STATUS_CODES.INTERNAL_SERVER_ERROR,
      INTERNAL_SERVER_ERROR
    );
  }
};

export const deleteImageFromCloudinary = async (url: string) => {
  try {
    const publicId = (url.split("/").pop() || "").split(".")[0] || "";
    await cloudinary.uploader.destroy(publicId, { invalidate: true });
  } catch (error) {
    throw new Error("Failed to delete image from Cloudinary");
  }
};

export default uploadOnCloudinary;
