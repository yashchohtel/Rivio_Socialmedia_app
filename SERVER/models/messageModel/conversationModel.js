import mongoose from "mongoose"; // Import mongoose

// conversation schema
const conversationSchema = new mongoose.Schema({

    // array of user ids who are part of the conversation
    participants: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    ],

    // messages array to store message ids
    message: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message"
        }
    ]

});

// Create a Conversation model
const Conversation = mongoose.model("Conversation", conversationSchema);

// Export the Conversation model
export default Conversation;