import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import sharp from "sharp";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const compressImage = async (localFilePath) => {
  try {
    const compressedPath = `${localFilePath}-compressed.jpg`;
    await sharp(localFilePath)
      .resize({ width: 800 })
      .jpeg({ quality: 80 })
      .toFile(compressedPath);

    return compressedPath;
  } catch (error) {
    console.error("Image compression failed:", error);
    return localFilePath;
  }
};

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    const compressedFilePath = await compressImage(localFilePath);

    // Upload the compressed file to Cloudinary
    const response = await cloudinary.uploader.upload(compressedFilePath, {
      resource_type: "auto",
    });

    // File uploaded successfully, delete the local files & compressed file
    fs.unlinkSync(localFilePath);
    fs.unlinkSync(compressedFilePath);

    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath);
    fs.unlinkSync(compressedFilePath); // Delete compressed file on failure
    return null;
  }
};

export { uploadOnCloudinary };
