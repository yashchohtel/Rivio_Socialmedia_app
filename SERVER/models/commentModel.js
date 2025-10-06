import mongoose from "mongoose"; // Import mongoose

// comment schema
const commentSchema = new mongoose.Schema({

    // post id on which the comment is made
    post: {
        type: Schema.Types.ObjectId,
        ref: "Post",
        required: true
    },

    // user id who made the comment
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    // comment text (main comment)
    text: {
        type: String,
        required: true,
        trim: true
    },

    // array to store replies to the comment
    replies: [{

        // user id who made the reply
        repliedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        // user id to whom the reply is made
        repliedTo: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        // reply text
        text: {
            type: String,
            required: true,
            trim: true
        },

        // timestamp of the reply
        createdAt: {
            type: Date,
            default: Date.now
        }
    }]

}, { timestamps: true });


const Comment = mongoose.model("Comment", commentSchema); // Creating a comment modal

export default Comment; // Export the comment modal