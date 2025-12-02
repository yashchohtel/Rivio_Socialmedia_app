import mongoose from "mongoose"; // Import mongoose

const messageSchema = new mongoose.Schema({

    // sender id
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    // receiver id
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    // message text
    text: {
        type: String,
        trim: true,
        default: ""
    },

});

// Create a message model
const Message = mongoose.model("Message", messageSchema);

// Export the message model
export default Message;