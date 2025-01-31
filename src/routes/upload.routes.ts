import express from "express";
import multer from "multer";
import { uploadFileToS3 } from "../utils/global/s3Upload.util.js";
import { deleteFileFromS3 } from "../utils/global/s3Delete.util.js";
import asyncHandler from "../utils/global/asyncHandler.util.js";
import multerMiddleware from "../middlewares/upload/multer.middleware.js";

const router = express.Router();

router.post(
  "/upload",
  multerMiddleware.single("file"),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const bucketName = process.env.S3_BUCKET_NAME;
    if (!bucketName) {
      return res.status(500).json({ message: "S3 bucket name is not defined" });
    }

    const result = await uploadFileToS3(req.file.buffer, req.file.originalname, req.file.mimetype);
    res.status(200).json({ message: "File uploaded successfully", data: result });
  })
);

router.delete(
  "/delete/:fileName",
  asyncHandler(async (req, res) => {
    const { fileName } = req.params;
    const result = await deleteFileFromS3(fileName);
    res.status(200).json(result);
  })
);

export default router;
