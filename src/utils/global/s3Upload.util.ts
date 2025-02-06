import { PutObjectCommand } from "@aws-sdk/client-s3";
import { STATUS_CODES } from "../../constants/global/statusCodes.constants.js";
import ApiError from ".././global/ApiError.util.js";
import s3Client from "../../config/s3.config.js";

export const uploadFileToS3 = async (fileBuffer: Buffer, fileName: string, contentType: string) => {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME!,
    Key: fileName,
    Body: fileBuffer,
    ContentType: contentType,
  };

  try {
    const putCommand = new PutObjectCommand(params);
    await s3Client.send(putCommand);

    // Return the public URL of the uploaded file
    return `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${fileName}`;
  } catch (error: any) {
    throw new ApiError(STATUS_CODES.INTERNAL_SERVER_ERROR, "File upload failed", error);
  }
};

export default uploadFileToS3;
