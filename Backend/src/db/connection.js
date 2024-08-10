import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  console.log("Attempting to connect to MongoDB...");
  console.log(`Connection string: ${process.env.MONGODB_URI}/${DB_NAME}`);

  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    console.log(
      `MongoDB connected successfully || DB HOST: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.error("MongoDB connection failed in connectDB function:");
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error(error.stack);
    process.exit(1);
  }
};

export default connectDB;
