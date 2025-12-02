import ErrorHandler from "../utils/errorHandler.js"; // Import custom error handler
import User from "../models/profileModel/userModel.js"; // Import User model
import Conversation from "../models/messageModel/conversationModel.js"; // Import Conversation model
import Message from "../models/messageModel/messageModel.js"; // Import message modal

// SEND MESSAGE 
export const sendMessage = async (req, res, next) => {

    // Extract user ID from request
    const { id: senderId } = req.user;
    if (!senderId) {
        return next(new ErrorHandler("Sender ID missing", 400));
    }

    // reciverId
    const { reciverId } = req.params;
    if (!reciverId) {
        return next(new ErrorHandler("Receiver ID missing", 400));
    }

    // message text
    const { messageText } = req.body;
    if (!messageText || messageText.trim() === "") {
        return next(new ErrorHandler("Message text required", 400));
    }

    // find if conversation exists or not
    let conversation = await Conversation.findOne({
        participants: { $all: [senderId, reciverId] }
    });

    // If not, create a new conversation
    if (!conversation) {
        conversation = await Conversation.create({
            participants: [senderId, reciverId],
            message: []
        });
    }

    // Create the message
    const newMessage = await Message.create({
        sender: senderId,
        receiver: reciverId,
        text: messageText
    });

    // Push message ID into conversation
    conversation.message.push(newMessage._id);

    // save the conversation
    await conversation.save();

    // send success response
    res.status(201).json({
        success: true,
        message: "Message sent successfully",
        data: newMessage,
    });

}

// GET MESSAGES
export const getMessages = async (req, res, next) => {

    // Extract user ID from request
    const { id: senderId } = req.user;
    if (!senderId) {
        return next(new ErrorHandler("Sender ID missing", 400));
    }

    // reciverId
    const { reciverId } = req.params;
    if (!reciverId) {
        return next(new ErrorHandler("Receiver ID missing", 400));
    }

    // finding conversation
    const conversation = await Conversation.findOne({
        participants: { $all: [senderId, reciverId] }
    });

    // if no conversation
    if (!conversation) {
        return res.status(200).json({
            success: true,
            messages: [],
        });
    }

    // return sucess response
    res.status(200).json({
        success: true,
        messages: conversation?.message,
    });

};
