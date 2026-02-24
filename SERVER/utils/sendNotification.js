import Notification from "../models/notificationModal/notificationModal"; // import the Notification model
import { getIO, getSocketId } from "../socket/socket.js"; // import functions to get the Socket.IO instance and socket ID

// Function to send a notification to a user
export const sendNotification = async (recipientId, type, initiatorId, postId = null, commentId = null, replyId = null) => {

    

}