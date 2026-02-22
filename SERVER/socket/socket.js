import { Server } from "socket.io" // Import Socket.IO server class

// Variable to hold the Socket.IO instance
let io; 

export const initializeSocket = (server) => {

    // Initialize Socket.IO server with CORS settings
    io = new Server(server, {
        cors: {
            origin: process.env.CLIENT_URL || `http://localhost:5173`,
            methods: ["GET", "POST"],
            credentials: true,
        },
    });

    io.on("connection", (socket) => {

        // Log when a new client connects
        console.log("New client connected:", socket.id);

        // log when a client disconnects
        socket.on("disconnect", () => {
            console.log("Client disconnected:", socket.id);
        });

    });

};

// function to get the Socket.IO instance 
export const getIO = () => {

    if (!io) {
        throw new Error("Socket.io not initialized")
    }

    return io

}