// import { v2 as cloudinary } from "cloudinary";
// import fs from "fs"; // fs -> file system

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// const uploadOnCloudinary = async (localFilePath) => {
//   try {
//     if (!localFilePath) return null;
//     //upload the file on cloudinary
//     const response = await cloudinary.uploader.upload(localFilePath, {
//       resource_type: "auto",
//     });
//     // file has been uploaded successfull
//     //console.log("file is uploaded on cloudinary ", response.url);
//     fs.unlinkSync(localFilePath);
//     return response;
//   } catch (error) {
//     fs.unlinkSync(localFilePath); // remove the locally saved temporary file as the upload operation got failed
//     return null;
//   }
// };

// export { uploadOnCloudinary };

import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configure Cloudinary with your environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
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
