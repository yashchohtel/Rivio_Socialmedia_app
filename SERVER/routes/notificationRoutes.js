import express from "express"; // Express framework for building APIs
import catchAsyncError from "../middleware/catchAsyncError.js"; // Import async error handler middleware
import { isUserAuth } from "../middleware/auth.js"; // Import authentication middleware
import { getAllNotifications } from "../controllers/notificationController.js";

const notificationRouter = express.Router(); // Creating an instance of Express Router

// NOTIFICATION RELATED ROUTES -------------------- //

// Get all Notifications [GET]
notificationRouter.get('/getAllNotifications', isUserAuth, catchAsyncError(getAllNotifications));
// 'http://localhost:5000/api/notifications/getAllNotifications'

export default notificationRouter; // export user router