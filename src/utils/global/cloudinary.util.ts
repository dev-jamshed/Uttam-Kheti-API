import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import fs from "fs";
import { STATUS_CODES } from "../../constants/global/statusCodes.js";
import { INTERNAL_SERVER_ERROR } from "../../constants/global/message.js";
import ApiError from "../global/ApiError.util.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath: string): Promise<UploadApiResponse | null> => {
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

export const deleteImageFromCloudinary = async (url: string): Promise<void> => {
  try {
    const publicId = (url.split("/").pop() || "").split(".")[0] || "";
    await cloudinary.uploader.destroy(publicId, { invalidate: true });
  } catch (error) {
    throw new Error("Failed to delete image from Cloudinary");
  }
};

export default uploadOnCloudinary;
