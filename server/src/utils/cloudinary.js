import { v2 as cloudinary } from "cloudinary";
import fs from "fs"; // File system

cloudinary.config({ 
  cloud_name: "drmx30kuy", 
  api_key: "175966663345468", 
  api_secret: "Bg0mPY22O4YUkSz00XhnRoX5GAc",
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath || !fs.existsSync(localFilePath)) {
            console.error("❌ Error: File does not exist at", localFilePath);
            return null;
        }

        // console.log("🚀 Uploading file:", localFilePath);

        // Upload the file to Cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
            folder: "uploads",  // Stores in "uploads/" folder
        });

        // console.log("✅ Cloudinary Upload Success:", response.secure_url);

        // Remove the local file after successful upload
        fs.unlinkSync(localFilePath);

        return response;

    } catch (error) { 
        console.error("❌ Cloudinary Upload Error:", error);

        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath); // Delete the file if upload fails
        }
        return null;
    }
};

export { uploadOnCloudinary };
