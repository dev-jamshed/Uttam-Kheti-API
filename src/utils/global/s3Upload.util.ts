import { PutObjectCommand } from "@aws-sdk/client-s3";
import { STATUS_CODES } from "../../constants/global/statusCodes.constants.js";
import ApiError from ".././global/ApiError.util.js";
import s3Client from "../../config/s3.config.js";
import { v4 as uuidv4 } from 'uuid';

export const uploadFileToS3 = async (fileBuffer: Buffer, fileName: string, contentType: string) => {
  const uniqueFileName = `${uuidv4()}-${fileName}`;
  const params = {
    Bucket: process.env.S3_BUCKET_NAME!,
    Key: uniqueFileName,
    Body: fileBuffer,
    ContentType: contentType,
  };

  try {
    const putCommand = new PutObjectCommand(params);
    await s3Client.send(putCommand);

    // Return the public URL of the uploaded file
    return `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${uniqueFileName}`;
  } catch (error: any) {
    throw new ApiError(STATUS_CODES.INTERNAL_SERVER_ERROR, "File upload failed", error);
  }
};

export default uploadFileToS3;
