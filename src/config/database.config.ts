import mongoose from "mongoose";
import {
  CONNECTION_ESTABLISHED,
  CONNECTION_ERROR,
} from "../constants/global/message.js";
import { MONGO_URI, DB_NAME } from "./env.config.js";

function dbConnect(): Promise<void> {
  if (!MONGO_URI || !DB_NAME) {
    throw new Error(
      `${MONGO_URI} or ${DB_NAME} is not defined in the environment variables`
    );
  }
  const connectionString = `${MONGO_URI}/${DB_NAME}`;
  return mongoose
    .connect(connectionString)
    .then(() => {
      console.log(`--> MongoDB ${CONNECTION_ESTABLISHED} by ${DB_NAME} `);
    })
    .catch((error: Error) => {
      console.error(`${CONNECTION_ERROR} to MongoDB ❌`, error);
      throw error;
    });
}

export default dbConnect;
