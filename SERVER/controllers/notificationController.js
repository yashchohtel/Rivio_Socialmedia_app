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


    // optimized notifications
    const optimizedNotificationData = notifications.map(notification => ({

        _id: notification._id, // notificatio id
        type: notification.type, // notification type

        // optimized recipient user object for response
        recipient: {
            id: notification.recipient._id,
            username: notification.recipient.username,
            fullName: notification.recipient.fullName,
            profileImage: notification.recipient.profileImage || null,
            isVerified: notification.recipient.isVerified,
            isPrivate: notification.recipient.isPrivate,

            followersCount: notification.recipient.followers?.length || 0,
            followingCount: notification.recipient.following?.length || 0,
            postsCount: notification.recipient.posts?.length || 0,
            bookmarksCount: notification.recipient.bookmarks?.length || 0,
        },

        // optimized sender user object for response
        sender: {
            id: notification.sender._id,
            username: notification.sender.username,
            fullName: notification.sender.fullName,
            profileImage: notification.sender.profileImage || null,
            isVerified: notification.sender.isVerified,
            isPrivate: notification.sender.isPrivate,

            followersCount: notification.sender.followers?.length || 0,
            followingCount: notification.sender.following?.length || 0,
            postsCount: notification.sender.posts?.length || 0,
            bookmarksCount: notification.sender.bookmarks?.length || 0,

        },

        comment: notification.comment?.text, // comment text
        post: notification.post?._id, // post id on which comment id made
        isRead: notification.isRead, // is read flag
        createdAt: notification.createdAt, // created
    }))


    // return response
    return res.status(200).json({
        userId,
        notifications
    });

}