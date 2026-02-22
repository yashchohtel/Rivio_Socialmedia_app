import mongoose from "mongoose"; // Import mongoose

// comment schema
const commentSchema = new mongoose.Schema({

    // post id on which the comment is made
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: true
    },

    // user id who made the comment
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    // comment text (main comment)
    text: {
        type: String,
        required: true,
        trim: true
    },

    // array to store user ids who liked the comment
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],

    // array to store replies to the comment
    replies: [{

        // user id who made the reply
        repliedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        // user id to whom the reply is made
        repliedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        // reply text
        text: {
            type: String,
            required: true,
            trim: true
        },

        // array to store user ids who liked the reply
        likes: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }],

        // timestamp of the reply
        createdAt: {
            type: Date,
            default: Date.now
        }
    }]

}, { timestamps: true });

const Comment = mongoose.model("Comment", commentSchema); // Creating a comment model

export default Comment; // Export the comment model