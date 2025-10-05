// Import mongoose to interact with MongoDB
import mongoose from "mongoose";

// Function to make connect with mongoDB
const connectDB = async () => {

    try {

        // Connect to MongoDB using the connection string from environment variables
        const connect = await mongoose.connect(process.env.MONGO_URI);

        // Log the connection details
        console.log(`MongoDB Connected: ${connect.connection.host}`);

    } catch (error) {

        // Log the error message if connection fails
        console.error("MongoDB connection failed:", error.message);

        // Exit the process with failure
        process.exit(1);

    };

};

export default connectDB; // Export the connectDB function for use in other files