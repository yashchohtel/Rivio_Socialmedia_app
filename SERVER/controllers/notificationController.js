import Notification from "../models/notificationModal/notificationModal.js"; // import notification modal
import User from "../models/profileModel/userModel.js"; // Import User model
import ErrorHandler from "../utils/errorHandler.js"; // Import custom error handler

// GET ALL NOTIFICAION
export const getAllNotifications = async (req, res, next) => {

    // getting user id
    const userId = req.user.id;

    // find notification of the loggedin user shorted by latest first
    const notifications = await Notification.find({ recipient: userId })
        .sort({ createdAt: -1 })
        .populate("recipient", "username fullName profileImage isVerified isPrivate followers following posts bookmarks")
        .populate("sender", "username fullName profileImage isVerified isPrivate followers following posts bookmarks")
        .populate("post", "images")
        .populate("comment", "text replies")

    console.log("------------------");
    console.log(notifications);


    // return response
    return res.status(200).json({
        userId,
        notifications
    });

}