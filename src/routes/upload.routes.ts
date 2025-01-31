import express from "express";
import multer from "multer";
import { uploadFileToS3 } from "../utils/s3Upload.js";
import asyncHandler from "../utils/global/asyncHandler.util.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post(
  "/upload",
  upload.single("file"),
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

export default router;
