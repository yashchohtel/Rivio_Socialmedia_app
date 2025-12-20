// Importing required modules
import express from "express"; // Express framework for building APIs
import dotenv from "dotenv"; // Import dotenv for environment variables
import connectDB from "./config/dataBase.js"; // Import the function to connect to MongoDB
import errorMiddleware from "./middleware/error.js"; // Import custom error handling middleware
import cookieParser from "cookie-parser"; // Import cookie-parser middleware
import postRouter from "./routes/postRoutes.js"; // Import post routes
import userRouter from "./routes/userRoutes.js"; // Import user routes
import chatRoutes from "./routes/chatsRoutes.js"; // Import chats routes
import cors from "cors"; // Middleware to enable CORS (Cross-Origin Resource Sharing)

// -------------------- CONFIGURATION  -------------------- //

// Load environment variables
dotenv.config();

// Initialize the Express app
const app = express();

// -------------------- MIDDLEWARES -------------------- //

// Enable JSON parsing for request bodies
app.use(express.json());
app.set('query parser', 'extended');

// Enable CORS to allow frontend to communicate with backend
app.use(cors({
    // Allow requests from this origin
    origin: [
        "http://localhost:5173",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"], // Allowed HTTP methods
    credentials: true, // Allow cookies to be sent with requests
}));

// Enable cookie parsing for incoming requests
app.use(cookieParser());

// -------------------- CONNECT TO MONGODB -------------------- //

connectDB(); // Call the function to connect to MongoDB

// -------------------- ROUTES -------------------- //

// user routes `/api/users`
app.use("/api/users", userRouter); // Use userRouter for handling user-related routes

// post routes `/api/posts`
app.use("/api/posts", postRouter); // Use postRouter for handling post-related routes

// post routes `/api/chats`
app.use("/api/chats", chatRoutes); // Use chatRoutes for handling chats-related routes

// -------------------- ERROR MIDDLEWARE -------------------- //

app.use(errorMiddleware); // Use error handling middleware

// -------------------- SERVER -------------------- //

// Port number for the server to listen on 
const PORT = process.env.PORT || 4000;

// Start the server and listen for requests
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});