import multer from "multer";

const storage = multer.memoryStorage();

const multerMiddleware = multer({ storage });

export default multerMiddleware;
