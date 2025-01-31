import app from "./app.js";
import dotenv from "dotenv";
import dbConnect from "./config/database.config.js";
import { CONNECTION_ERROR } from "./constants/global/message.constants.js";

dotenv.config();
dbConnect().catch((error: Error) => {
  console.error(`${CONNECTION_ERROR} to MongoDB ❌`, error);
});

const PORT = process.env.PORT;
const HOST = process.env.HOST;
const ENV = process.env.NODE_ENV;
const PROTOCOL = process.env.PROTOCOL;

app.listen(PORT, () => {
  console.log(`Server is running on ${PROTOCOL}://${HOST}:${PORT} in ${ENV} mode`);
});
