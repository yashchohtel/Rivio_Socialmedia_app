import { log } from "console";
import Notification from "../models/notificationModal/notificationModal.js"; // import the Notification model
import { getIO, getSocketId } from "../socket/socket.js"; // import functions to get the Socket.IO instance and socket ID

// Function to send a notification to a user
export const sendNotification = async (recipientId, senderId, type, postId = null, commentId = null, replyId = null) => {

    try {

        // Create a new notification document in the database
        const notification = await Notification.create({
            recipient: recipientId,
            sender: senderId,
            type,
            post: postId,
            comment: commentId,
            reply: replyId,
        });

        // Check if user is online
        const socketId = getSocketId(recipientId);

        // If user is online, emit the notification to their socket
        if (socketId) {
            const io = getIO();

            // populate notificaion
            const populatedNotification = await Notification.findById(notification._id)
                .populate("sender", "username fullName profileImage isVerified isPrivate followers following posts bookmarks")
                .populate("post", "media")
                .populate("comment", "text replies")

            // finding reply data if exist
            let replyData = null;

            if (populatedNotification.comment && replyId) {
                const foundReply = populatedNotification.comment.replies?.find(r => r._id.equals(replyId));
                replyData = foundReply ? {
                    id: foundReply._id,
                    replyText: foundReply.text || null,
                } : null;
            }

            const optimizedNotification = {
                _id: populatedNotification._id, // notificaion id
                type: populatedNotification.type, // notificaon type

                // sender user detail
                sender: {
                    id: populatedNotification.sender._id,
                    username: populatedNotification.sender.username,
                    fullName: populatedNotification.sender.fullName,
                    profileImage: populatedNotification.sender.profileImage || null,
                    isVerified: populatedNotification.sender.isVerified,
                    isPrivate: populatedNotification.sender.isPrivate,
                    followersCount: populatedNotification.sender.followers?.length || 0,
                    followingCount: populatedNotification.sender.following?.length || 0,
                    postsCount: populatedNotification.sender.posts?.length || 0,
                    bookmarksCount: populatedNotification.sender.bookmarks?.length || 0,
                },

                // post detail
                post: populatedNotification.post ? {
                    id: populatedNotification.post._id,
                    thumbnail: populatedNotification.post.media?.[0]?.url || null,
                } : null,

                // comment data
                comment: populatedNotification.comment ? {
                    id: populatedNotification.comment._id,
                    commentText: populatedNotification.comment.text || null,
                } : null,

                // reply data
                reply: replyData,

                // isread flage
                isRead: false,

                // createdAt
                createdAt: populatedNotification.createdAt,
            }

            io.to(socketId).emit("notification", optimizedNotification);
        }

    } catch (error) {
        console.error("Error sending notification:", error);
    }

}

// function to delete notification if the action is reversed
export const deleteNotification = async (recipientId, senderId, type, postId = null, commentId = null, replyId = null) => {

    try {

        const deleted = await Notification.findOneAndDelete({
            recipient: recipientId,
            sender: senderId,
            type,
            post: postId,
            comment: commentId,
            reply: replyId,
            isRead: false,
        });

        // emit delete notificaion event
        if (deleted) {
            const socketId = getSocketId(recipientId);
            if (socketId) {
                const io = getIO();
                io.to(socketId).emit("notification_deleted", { type });
            }
        }

    } catch (error) {

        console.error("Error deleting notification:", error);

    }

}