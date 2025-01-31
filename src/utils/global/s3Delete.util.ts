import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { STATUS_CODES } from "../../constants/global/statusCodes.constants.js";
import ApiError from ".././global/ApiError.util.js";
import s3Client from "../../config/s3.config.js";

export const deleteFileFromS3 = async (fileName: string) => {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME!,
    Key: fileName,
  };

  try {
    const command = new DeleteObjectCommand(params);
    await s3Client.send(command);
    return { message: "File deleted successfully" };
  } catch (error: any) {
    throw new ApiError(STATUS_CODES.INTERNAL_SERVER_ERROR, "File deletion failed", error);
  }
};


export default deleteFileFromS3;
