import { DeleteObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import { STATUS_CODES } from "../../constants/global/statusCodes.constants.js";
import ApiError from ".././global/ApiError.util.js";
import s3Client from "../../config/s3.config.js";

export const deleteFileFromS3 = async (fileUrl: string) => {

  const url = new URL(fileUrl);
  const key = decodeURIComponent(url.pathname.replace(/^\//, ''));

  const params = {
    Bucket: process.env.S3_BUCKET_NAME!,
    Key: key,
  };

  console.log("Params:", params);

  try {
   
    const headCommand = new HeadObjectCommand(params);
    await s3Client.send(headCommand);
    const deleteCommand = new DeleteObjectCommand(params);
    await s3Client.send(deleteCommand);
    return true;
  } catch (error: any) {
    // throw new ApiError(STATUS_CODES.INTERNAL_SERVER_ERROR, "File deletion failed", error);
  }
};

export default deleteFileFromS3;