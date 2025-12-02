import express from "express"; // Express framework for building APIs
import catchAsyncError from "../middleware/catchAsyncError.js"; // Import async error handler middleware
import { isUserAuth } from "../middleware/auth.js"; // Import authentication 
import { getMessages, sendMessage } from "../controllers/chatsController.js"; // messages controller

const chatRoutes = express.Router(); // Creating an instance of Express Router

// MESSAGES RELATED ROUTES -------------------- //

// Create post [POST]
chatRoutes.post('/sendMessage/:reciverId', isUserAuth, catchAsyncError(sendMessage));
// 'http://localhost:5000/api/chats/sendMessage/:reciverId'

// Create post [POST]
chatRoutes.get('/getMessages/:reciverId', isUserAuth, catchAsyncError(getMessages));
// 'http://localhost:5000/api/chats/getMessages/:reciverId'

export default chatRoutes; // export user router