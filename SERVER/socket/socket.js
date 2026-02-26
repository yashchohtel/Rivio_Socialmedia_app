import { Server } from "socket.io" // Import Socket.IO server class

// Variable to hold the Socket.IO instance
let io;

// Map to keep track of online users and their corresponding socket IDs
const onlineUsers = new Map();

// Function to initialize the Socket.IO server
export const initializeSocket = (server) => {

    // Initialize Socket.IO server with CORS settings
    io = new Server(server, {
        cors: {
            origin: process.env.CLIENT_URL || `http://localhost:5173`,
            methods: ["GET", "POST"],
            credentials: true,
        },
    });

    // Listen for new client connections to the Socket.IO server
    io.on("connection", (socket) => {

        // Log when a new client connects 
        console.log("New client connected:", socket.id);

        /* -------------------------------------- */

        // Listen for "register" event from the client to register the user and store their socket ID
        socket.on("register", (userId) => {
            onlineUsers.set(userId, socket.id);
            console.log("User registered:", userId, socket.id);
        });

        /* -------------------------------------- */

        // user joins post room 
        socket.on("join_post_room", (postId) => {
            socket.join(postId.toString());
        });

        /* -------------------------------------- */

        // log when a client disconnects
        socket.on("disconnect", () => {
            console.log("Client disconnected:", socket.id);
        });

    });

};

// function to get the Socket.IO instance 
export const getIO = () => {

    // Throw an error if the Socket.IO instance has not been initialized yet
    if (!io) throw new Error("Socket.io not initialized");

    // Return the Socket.IO instance
    return io

}

// function to get the socket ID for a given user ID from the onlineUsers map
export const getSocketId = (userId) => {
    return onlineUsers.get(userId.toString());
};