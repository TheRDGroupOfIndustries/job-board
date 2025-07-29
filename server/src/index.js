import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});
import connectDB from "./db/index.js";
import { app } from "./app.js";
import colors from "colors";



connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running on port: ${process.env.PORT}`.bgBlue);
    });
  })
  .catch((error) => {
    console.error("MONGODB connection failed!", error);
    process.exit(1);
  });
