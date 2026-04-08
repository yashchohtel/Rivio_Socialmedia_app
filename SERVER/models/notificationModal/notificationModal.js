import mongoose from "mongoose"; // Import mongoose

// notification schema
const notificationSchema = new mongoose.Schema({

    // User who receives the notification (e.g., the one whose post was liked, who got a new follower, etc.)
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    // User who triggered the notification (e.g., the one who liked a post, commented, etc.)
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    // Notification type
    type: {
        type: String,
        enum: [
            "FOLLOW", // when a user follows another user
            "FOLLOW_REQUEST", // when a user sends a follow request to a private account
            "FOLLOW_ACCEPTED", // when a private account accepts a follow request
            "POST_LIKE", // when a user likes a post
            "POST_COMMENT", // when a user comments on a post
            "COMMENT_REPLY", // when a user replies to a comment
            "COMMENT_LIKE", // when a user likes a comment
            "REPLY_LIKE", // when a user likes a reply
        ],
        required: true
    },

    // Optional fields to store additional information related to the notification

    // post id related to the notification (e.g., for POST_LIKE, POST_COMMENT)
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        default: null
    },

    // comment id related to the notification (e.g., for COMMENT_REPLY, COMMENT_LIKE)
    comment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
        default: null
    },

    // reply id related to the notification (e.g., for COMMENT_REPLY, REPLY_LIKE)
    reply: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Reply",
        default: null
    },

    // flag to indicate if the notification has been read by the recipient
    isRead: {
        type: Boolean,
        default: false
    }

}, { timestamps: true }); // Enable timestamps 

// Compound index for fast queries
notificationSchema.index({ recipient: 1, createdAt: -1 });

// create notification model
const Notification = mongoose.model("Notification", notificationSchema);

// export the notification model
export default Notification;


