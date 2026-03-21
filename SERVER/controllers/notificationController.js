import Notification from "../models/notificationModal/notificationModal.js"; // import notification modal
import ErrorHandler from "../utils/errorHandler.js"; // Import custom error handler

// GET ALL NOTIFICAION
export const getAllNotifications = async (req, res, next) => {

    // getting user id
    const userId = req.user.id;

    // find notification of the loggedin user shorted by latest first
    const notifications = await Notification.find({ recipient: userId })
        .sort({ createdAt: -1 })
        .populate("sender", "username fullName profileImage isVerified isPrivate followers following posts bookmarks")
        .populate("post", "media")
        .populate("comment", "text replies")

    // optimized notifications
    const optimizedNotificationData = notifications.map((notification) => {

        // finding reply data if exist
        let replyData = null;
        if (notification.comment && notification.reply) {

            const foundReply = notification.comment.replies?.find((r) => (
                r._id.equals(notification.reply)
            ));

            replyData = foundReply ? {
                id: foundReply._id,
                replyText: foundReply.text || null,
            } : null;

        }

        // return optimized notification object
        return {

            _id: notification._id, // notificatio id
            type: notification.type, // notification type

            // optimized sender user object for response (recipient is not included his datais alrady in frontend)
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

            // post data
            post: notification.post ? {
                id: notification.post?._id, // post id on which comment id made
                thumbnail: notification.post.media?.[0]?.url || null, // first image url of media for thumbnail
            } : null,

            // comment data
            comment: notification.comment ? {
                id: notification.comment?._id, // comment id
                commentText: notification.comment?.text || null, // comment text
            } : null,

            // reply data
            reply: replyData,

            isRead: notification.isRead, // is read flag
            createdAt: notification.createdAt, // created

        }

    })

    // mark all notificaion as read
    await Notification.updateMany(
        { recipient: userId, isRead: false },
        { $set: { isRead: true } }
    );

    // return response
    return res.status(200).json({
        success: true,
        optimizedNotificationData
    });

};

// DELETE SINGLE NOTIFICATION
export const deleteNotification = async (req, res, next) => {

    // getting user id
    const userId = req.user.id;

    // getting notificaion id
    const notificationId = req.params.notificationId;

    // finding notificaion and deleting
    const notification = await Notification.findOneAndDelete({
        _id: notificationId,
        recipient: userId  // security — only owner can delete notification
    });
    if (!notification) return next(new ErrorHandler("Notification not found", 404));

    // return response
    return res.status(200).json({
        success: true,
        message: "Notification deleted",
    });

};

// DELETE ALL NOTIFICATIONS
export const deleteAllNotifications = async (req, res, next) => {

    // getting user id
    const userId = req.user.id;

    // delete all notificions related to user
    await Notification.deleteMany({ recipient: userId });

    // return response
    return res.status(200).json({
        success: true,
        message: "All notifications deleted",
    });

};

// GET UNREAD NOTIFICATION COUNT
export const getUnreadNotificationCount = async (req, res, next) => {

    // get user id
    const userId = req.user.id;

    // get count of unread notificaions
    const unreadCount = await Notification.countDocuments({
        recipient: userId,
        isRead: false
    });

    // return response
    return res.status(200).json({
        success: true,
        unreadCount
    });

};