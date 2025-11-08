import express from "express"; // Express framework for building APIs
import catchAsyncError from "../middleware/catchAsyncError.js"; // Import async error handler middleware
import { isUserAuth } from "../middleware/auth.js"; // Import authentication middleware
import { createPost } from "../controllers/postController.js";
import { upload } from "../middleware/multer.js"; // Import multer middleware for file uploads

const postRouter = express.Router(); // Creating an instance of Express Router

// AUTHENTICATION USER ROUTES -------------------- //

// Register [POST]
postRouter.post('/createPost', isUserAuth, upload.array("postImage", 10), catchAsyncError(createPost));
// 'http://localhost:5000/api/posts/createPost'

export default postRouter; // export user router