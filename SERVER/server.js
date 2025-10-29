// Importing required modules
import express from "express"; // Express framework for building APIs
import dotenv from "dotenv"; // Import dotenv for environment variables
import connectDB from "./config/dataBase.js"; // Import the function to connect to MongoDB
import errorMiddleware from "./middleware/error.js"; // Import custom error handling middleware
import userRouter from "./routes/userRoutes.js"; // Import user routes
import cookieParser from "cookie-parser"; // Import cookie-parser middleware

// -------------------- CONFIGURATION  -------------------- //

// Load environment variables
dotenv.config();

// Initialize the Express app
const app = express();

// -------------------- MIDDLEWARES -------------------- //

// Enable JSON parsing for request bodies
app.use(express.json());
app.set('query parser', 'extended');

// Enable cookie parsing for incoming requests
app.use(cookieParser()); 

// -------------------- CONNECT TO MONGODB -------------------- //

connectDB(); // Call the function to connect to MongoDB

// -------------------- ROUTES -------------------- //

// user routes `/api/users`
app.use("/api/users", userRouter); // Use userRouter for handling user-related routes

// -------------------- ERROR MIDDLEWARE -------------------- //

app.use(errorMiddleware); // Use error handling middleware

// -------------------- SERVER -------------------- //

// Port number for the server to listen on 
const PORT = process.env.PORT || 4000;

// Start the server and listen for requests
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});