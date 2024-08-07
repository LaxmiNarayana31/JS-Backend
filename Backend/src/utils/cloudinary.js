import { v2 as cloudinary } from "cloudinary"
import fs from "fs" // fs -> file system


// upload image files in cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDNARY_CLOUD_NAME,
    api_key: process.env.CLOUDNARY_API_KEY,
    api_secret: process.env.CLOUDNARY_API_SECRET
})

const uploadOnCloudnary = async (localFilePath) => {
    try {
        if (!localFilePath) return null
        // upload files in cloudinary 
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        // file has been uploaded successfully
        console.log("Successfully uploaded on cloudinary", response.url);
        return response
        
    } catch (error) {
        fs.unlinkSync(localFilePath) // remove the locally saved temporary files as upload operation got failed
        return null
    }
}

export {uploadOnCloudnary}