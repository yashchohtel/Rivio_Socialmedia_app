// A wrapper function to catch errors in async route handlers/controllers
const catchAsyncError = (passedFunction) => {

    // Return a middleware function that Express can use
    return async (req, res, next) => {
        try {
            // Execute the async controller function with request, response, and next
            await passedFunction(req, res, next);
        } catch (err) {
            // If an error occurs, pass it to the Express error handling middleware
            next(err);
        }
    };

};

export default catchAsyncError; // Export the catchAsyncError middleware