import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import sharp from "sharp"; // Import sharp for image processing

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const compressImage = async (localFilePath) => {
  try {
    const compressedPath = `${localFilePath}-compressed.jpg`;
    await sharp(localFilePath)
      .resize({ width: 800 }) // Resize to a width of 800px, maintaining aspect ratio
      .jpeg({ quality: 80 }) // Compress the image with 80% quality
      .toFile(compressedPath);

    return compressedPath;
  } catch (error) {
    console.error("Image compression failed:", error);
    return localFilePath; // Return the original path if compression fails
  }
};

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    // Compress the image before uploading
    const compressedFilePath = await compressImage(localFilePath);

    // Upload the compressed file to Cloudinary
    const response = await cloudinary.uploader.upload(compressedFilePath, {
      resource_type: "auto",
    });

    // File uploaded successfully, delete the local files
    fs.unlinkSync(localFilePath);
    fs.unlinkSync(compressedFilePath); // Also delete the compressed file

    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath);
    fs.unlinkSync(compressedFilePath); // Delete compressed file on failure
    return null;
  }
};

export { uploadOnCloudinary };

/*
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configure Cloudinary with your environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  timeout: 60000,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      console.error("Local file path is undefined or null");
      return null;
    }

    console.log(`Uploading file to Cloudinary: ${localFilePath}`);

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    console.log("File uploaded successfully:", response);

    fs.unlinkSync(localFilePath);
    console.log(`Local file ${localFilePath} deleted successfully`);

    return response;
  } catch (error) {
    console.error("Error uploading file to Cloudinary:", error);

    try {
      fs.unlinkSync(localFilePath);
      console.log(`Local file ${localFilePath} deleted after failure`);
    } catch (unlinkError) {
      console.error(`Error deleting local file ${localFilePath}:`, unlinkError);
    }

    return null;
  }
};

export { uploadOnCloudinary };
*/
