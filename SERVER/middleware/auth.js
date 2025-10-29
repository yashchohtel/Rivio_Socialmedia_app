import jwt from "jsonwebtoken"; // Import JWT for authentication
import catchAsyncError from "./catchAsyncError.js"; // Importing catchAsyncError middleware
import User from "../models/profileModel/userModel.js"; // Importing user model

// Middleware to handle authentication
export const isUserAuth = catchAsyncError(async (req, res, next) => {

    // Extract token from cookies
    const { token } = req.cookies;
    
    // If token is missing, return unauthorized response
    if (!token) {
        return res.status(401).json({ success: false, message: "Not authorized" });
    }

    // Verify and decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // finding user by ID from the decoded token
    const user = await User.findById(decoded.id);

    // If user is not found, return unauthorized response
    if (!user) {
        return res.status(401).json({ success: false, message: "User not found" });
    }

    // attach full user data
    req.user = user; 
    
    next();
    
});
