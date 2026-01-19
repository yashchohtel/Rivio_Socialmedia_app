import fs from "fs"; // Import file system module
import path from "path"; // Import path module
import sharp from "sharp"; // Import sharp for image processing
import cloudinary from "../config/cloudinary.js"; // Import Cloudinary configuration

// Function to optimize image using sharp
export const optimizeImage = async (inputPath) => {

    // (1) Create optimized images folder path if not exists
    const optimizedFolder = path.join(process.cwd(), "public", "tmpOptimized");
    await fs.promises.mkdir(optimizedFolder, { recursive: true });

    // (2) Create unique optimized file name
    const baseName = path.basename(inputPath, path.extname(inputPath));
    const optimizedName = `opt-${baseName}-${Date.now()}.webp`;
    const optimizedPath = path.join(optimizedFolder, optimizedName);

    // (3). Sharp se optimize karo (resize + compress + convert)
    await sharp(inputPath)
        .resize({ width: 1080, withoutEnlargement: true })
        .webp({ quality: 90 })
        .toFile(optimizedPath);

    // (4) Optimized file ka path return karo
    return optimizedPath;

};

// Function to upload file to Cloudinary
export const uploadFileToCloudinary = async (filePath, mimetype, optimizedPath, folderName) => {

    const resourceType = mimetype && mimetype.startsWith("video") ? "video" : "image";
    const uploadPath = optimizedPath || filePath;

    try {

        // Upload video directly
        if (resourceType === "video") {
            const result = await cloudinary.uploader.upload(filePath, {
                folder: folderName,
                resource_type: "video",
            });
        };

        // For images upload optimized file
        const result = await cloudinary.uploader.upload(uploadPath, {
            folder: folderName,
            resource_type: resourceType,
        });
        
        // Return upload result
        return {
            url: result.secure_url,
            public_id: result.public_id,
            mediaType: resourceType,
        };

    } catch (error) {

        // If any error occurs, pass it to the error handler middleware
        throw new Error(error.message);

    }
};