import app from "./app.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT;
const HOST = process.env.HOST;
const ENV = process.env.NODE_ENV;
const PROTOCOL = process.env.PROTOCOL;

app.listen(PORT, () => {
  console.log(
    `Server is running on ${PROTOCOL}://${HOST}:${PORT} in ${ENV} mode`
  );
});
