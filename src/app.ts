import express from "express";
import bodyParser from "body-parser";
import adminRouter from "./routes/admin/index.js";
import { API_PREFIX } from "./constants/global/app.constants.js";
import errorHandler from "./middlewares/error/errorHandler.middleware.js";

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(API_PREFIX, adminRouter);

app.use(errorHandler);

export default app;
