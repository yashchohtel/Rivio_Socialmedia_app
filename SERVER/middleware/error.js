import ErrorHandler from "../utils/errorHandler.js"; // Import the custom ErrorHandler

// Global error handling middleware
const errorMiddleware = (err, req, res, next) => {

    // Set default status code and message if not provided
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";

    // Wrong MongoDB ObjectId Error
    if (err.name === "CastError") {
        const message = `Invalid ${err.path}`;
        err = new ErrorHandler(message, 400);
    }

    // Duplicate Key Error
    if (err.code === 11000) {
        const duplicateField = Object.keys(err.keyValue)[0]; // e.g., 'email' or 'username'
        const message = `Duplicate ${duplicateField}: ${err.keyValue[duplicateField]}`;
        err = new ErrorHandler(message, 400);
    }

    // Handle invalid JSON Web Token (JWT) errors
    if (err.name === "JsonWebTokenError") {
        const message = "Json Web Token is invalid, Try again.";
        err = new ErrorHandler(message, 400);
    }

    // Handle expired JSON Web Token errors
    if (err.name === "TokenExpiredError") {
        const message = "Json Web Token is expired, Try again.";
        err = new ErrorHandler(message, 400);
    }

    // Send error response
    res.status(err.statusCode).json({
        success: false,
        message: err.message,
    });

};

export default errorMiddleware; // Export the error middleware
