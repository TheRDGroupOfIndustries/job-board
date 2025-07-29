import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    console.log(`MongoDB connected successfully!`.bgGreen);
  } catch (error) {
    console.log(`MongoDB connection failed! ${error}`.bgRed);
    process.exit(1);
  }
};

export default connectDB;
