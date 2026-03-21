import express from "express"; // Express framework for building APIs
import catchAsyncError from "../middleware/catchAsyncError.js"; // Import async error handler middleware
import { isUserAuth } from "../middleware/auth.js"; // Import authentication middleware
import { deleteAllNotifications, deleteNotification, getAllNotifications, getUnreadNotificationCount } from "../controllers/notificationController.js";

const notificationRouter = express.Router(); // Creating an instance of Express Router

// NOTIFICATION RELATED ROUTES -------------------- //

// Get all Notifications [GET]
notificationRouter.get('/getAllNotifications', isUserAuth, catchAsyncError(getAllNotifications));
// 'http://localhost:5000/api/notifications/getAllNotifications'

// Delete Single Notification [DELETE]
notificationRouter.delete('/deleteNotification/:notificationId', isUserAuth, catchAsyncError(deleteNotification));
// 'http://localhost:5000/api/notifications/deleteNotification/:notificationId'

// Delete All Notifications [DELETE]
notificationRouter.delete('/deleteAllNotifications', isUserAuth, catchAsyncError(deleteAllNotifications));
// 'http://localhost:5000/api/notifications/deleteAllNotifications'

// Get Unread Notification Count [GET]
notificationRouter.get('/getUnreadCount', isUserAuth, catchAsyncError(getUnreadNotificationCount));
// 'http://localhost:5000/api/notifications/getUnreadCount'

export default notificationRouter; // export user router