import ErrorHandler from "../utils/errorHandler.js"; // Import custom error handler
import User from "../models/profileModel/userModel.js"; // Import User model
import Post from "../models/profileModel/postModel.js"; // Import Post model
import fs from "fs"; // Import file system module
import cloudinary from "../config/cloudinary.js"; // Import Cloudinary configuration
import mongoose from "mongoose"; // Import mongoose for ObjectId
import { optimizeImage, uploadFileToCloudinary } from "../utils/postUplodUtils.js"; // Import image upload utilities

// CREATE POST
export const createPost = async (req, res, next) => {

    // Extract user ID from request
    const { id } = req.user;

    // access files from request
    const files = req.files || [];

    // Extract caption, location, tags from request body
    const caption = req.body.caption?.trim() || "";
    const location = req.body.location?.trim() || "";

    // Parse & convert tags string to array of ObjectIds
    let tags = [];
    if (req.body.tags) {
        const parsed = JSON.parse(req.body.tags);
        tags = parsed.map((id) => new mongoose.Types.ObjectId(id));
    }

    // to keep track of uploaded files for cleanup in case of error
    let uploadResults = []

    // folder name on Cloudinary
    const folderName = "RIVIO_posts";

    try {

        // Find user by ID and exclude password from the result
        const user = await User.findById(id).select("-password");
        if (!user) return next(new ErrorHandler("User not found", 404));

        // Check if files are uploaded
        if (!files || files.length === 0) return next(new ErrorHandler("No files uploaded", 400));

        // Optimize all images concurrently using potimizeImage utility
        const optimizedPaths = await Promise.all(files.map(f => optimizeImage(f.path)));

        // Upload each file to Cloudinary by uploadFileToCloudinary helper
        uploadResults = await Promise.all(files.map((file, index) =>
            uploadFileToCloudinary(file.path, file.mimetype, optimizedPaths[index], folderName,)
        ));

        // Build media array for post
        const media = uploadResults.map((r) => ({
            mediaType: r.mediaType,
            url: r.url,
            cloudinaryPublicId: r.public_id || r.publicId || r.public_id,
        }));

        // Create new post document
        const post = new Post({
            caption,
            user: user._id,
            media,
            tags,
            location: location || undefined
        });

        // Save post to database
        await post.save();

        // Clean up temporary files (both original and optimized)
        await Promise.allSettled([
            // temp original files delete
            ...files.map(f => fs.promises.unlink(f.path)
                .catch(err => console.warn("Original delete fail:", f.path, err.message))
            ),

            // temp optimized files delete
            ...optimizedPaths.map(p => fs.promises.unlink(p)
                .catch(err => console.warn("Optimized delete fail:", p, err.message))
            )
        ]);

        // send success response
        res.status(201).json({
            success: true,
            uploadResults,
        });

    } catch (error) {

        console.error("Post creation failed:", error);

        // cleanup original temp files
        await Promise.all(files.map((f) => fs.promises.unlink(f.path).catch(() => { })));

        // cleanup optimized files (optional)
        await Promise.all((optimizedPaths || []).map(p => fs.promises.unlink(p).catch(() => { })));

        // cleanup cloudinary uploads if any succeeded
        if (uploadResults.length > 0) {
            await Promise.all(
                uploadResults.map((r) =>
                    cloudinary.uploader.destroy(r.public_id || r.publicId).catch(() => { })
                )
            );
        }

        return next(new ErrorHandler(error.message || "Server Error", 500));
    }

};