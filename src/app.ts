import express from "express";
import bodyParser from "body-parser";
import adminRouter from "./routes/admin/index.js";
import customerRouter from "./routes/customer/index.js";
import uploadRouter from "./routes/upload.routes.js";
import { API_PREFIX } from "./constants/global/app.constants.js";
import errorHandler from "./middlewares/error/errorHandler.middleware.js";

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(`${API_PREFIX}/admin`, adminRouter);
app.use(`${API_PREFIX}/customer`, customerRouter);
app.use(`${API_PREFIX}/upload`, uploadRouter);

app.use(errorHandler);

export default app;
