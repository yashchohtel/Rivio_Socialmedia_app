import express from "express"; // Express framework for building APIs
import { editProfile, followUnfollowUser, getMyProfile, getSuggestedUsers, getUserProfile, loginUser, logoutUser, registerUser, removeProfilePicture } from "../controllers/userController.js"; // Import controller
import catchAsyncError from "../middleware/catchAsyncError.js"; // Import async error handler middleware
import { isUserAuth } from "../middleware/auth.js"; // Import authentication middleware
import { upload } from "../middleware/multer.js"; // Import multer middleware for file uploads

const userRouter = express.Router(); // Creating an instance of Express Router

// AUTHENTICATION USER ROUTES -------------------- //

// Register [POST]
userRouter.post('/registerUser', catchAsyncError(registerUser));
// 'http://localhost:5000/api/users/registerUser'

// Login [POST]
userRouter.post('/loginUser', catchAsyncError(loginUser));
// 'http://localhost:5000/api/users/loginUser'

// Logout [POST]
userRouter.post('/logoutUser', catchAsyncError(logoutUser));
// 'http://localhost:5000/api/users/logoutUser'

// Get my profile [get]
userRouter.get('/getMyProfile', isUserAuth, catchAsyncError(getMyProfile));
// 'http://localhost:5000/api/users/getMyProfile'

// Get user profile [get]
userRouter.get('/getUserProfile/:id', isUserAuth, catchAsyncError(getUserProfile));
// 'http://localhost:5000/api/users/getUserProfile/:id'

// Edit user profile [put]
userRouter.put('/editProfile', isUserAuth, upload.single("profileImage"), catchAsyncError(editProfile));
// 'http://localhost:5000/api/users/editProfile'

// Get suggested users [get]
userRouter.get('/suggestedUsers', isUserAuth, catchAsyncError(getSuggestedUsers));
// 'http://localhost:5000/api/users/suggestedUsers'

// delete profile picture [put]
userRouter.put('/removeProfilePicture', isUserAuth, catchAsyncError(removeProfilePicture));
// 'http://localhost:5000/api/users/removeProfilePicture'

// follow and unfollow user [post]
userRouter.post('/followUnfollowUser/:targetUserId', isUserAuth, catchAsyncError(followUnfollowUser));
// 'http://localhost:5000/api/users/followUnfollowUser/:targetUserId'

export default userRouter; // export user router