import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { STATUS_CODES } from "../constants/global/statusCodes.constants.js";
import ApiError from "./global/ApiError.util.js";
import s3Client from "../config/s3.config.js";
import asyncHandler from "./global/asyncHandler.util.js";


export const uploadFileToS3 = async (fileBuffer: Buffer, fileName: string, contentType: string) => {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME!,
    Key: fileName,
    Body: fileBuffer,
    ContentType: contentType,
  };

  try {
    const command = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: params.Key,
    });
    // Generate a pre-signed URL for the uploaded file
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // URL expires in 1 hour
    return signedUrl; // Return the pre-signed URL
  } catch (error: any) {
    console.error("S3 Upload Error:", error);
    throw new ApiError(STATUS_CODES.INTERNAL_SERVER_ERROR, "File upload failed", error);
  }
};

export default uploadFileToS3;
