



// Custom ErrorHandler class extending the built-in Error class for handling errors in an Express application
class ErrorHandler extends Error {

    constructor(message, statusCode) {
        super(message); // Call the parent class (Error) constructor with the message
        this.statusCode = statusCode; // Set the HTTP status code for the error

        // Captures the stack trace (line number, file, etc.) for better debugging
        Error.captureStackTrace(this, this.constructor);
    }
}

export default ErrorHandler; // Export the ErrorHandler class