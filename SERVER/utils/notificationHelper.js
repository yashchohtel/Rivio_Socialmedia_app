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
            io.to(socketId).emit("notification", notification);
        }

    } catch (error) {
        console.error("Error sending notification:", error);
    }

}

// function to delete notification if the action is reversed
export const deleteNotification = async (recipientId, senderId, type, postId = null, commentId = null, replyId = null) => {

    try {

        await Notification.findOneAndDelete({
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